import 'dotenv/config';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

// ---- 공통 유틸 ----
async function resetDb() {
  await prisma.$transaction([
    prisma.refreshToken.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.productLike.deleteMany(),
    prisma.articleLike.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.product.deleteMany(),
    prisma.article.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function register(email: string, password: string, nickname: string) {
  return request(app)
    .post('/auth/register')
    .set('Content-Type', 'application/json')
    .send({ email, password, nickname });
}

async function login(email: string, password: string) {
  const res = await request(app)
    .post('/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, password });
  expect(res.status).toBe(200);
  expect(typeof res.body.accessToken).toBe('string');
  return res.body.accessToken as string;
}

async function makeUserAndToken(u: { email: string; password: string; nickname: string }) {
  await register(u.email, u.password, u.nickname);
  return login(u.email, u.password);
}

const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

async function createProduct(token: string, body: any) {
  const res = await request(app).post('/products').set(auth(token)).send(body);
  expect([200, 201]).toContain(res.status);
  expect(res.body).toHaveProperty('id');
  return res.body; // 생성된 product 반환
}

// ---- 테스트 본문 ----
describe('상품(products) 통합 테스트 (공개 + 보호)', () => {
  const owner = { email: 'owner@example.com', password: 'pass1234', nickname: 'owner' };
  const liker = { email: 'liker@example.com', password: 'pass1234', nickname: 'liker' };

  const productInput = {
    name: '테스트 상품',
    description: '설명',
    price: 10000,
    tags: ['tag1', 'tag2'],
    imageUrl: 'https://picsum.photos/200',
  };

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ---------- 공개(인증 불필요) ----------
  describe('공개 조회 (no auth)', () => {
    it('GET /products → 배열 반환', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /products 에 사전 삽입한 상품이 보인다', async () => {
      const u = await prisma.user.create({
        data: { email: 'pub@ex.com', nickname: 'pub', password: 'hashed' },
      });
      await prisma.product.create({
        data: {
          name: '공개상품',
          description: '공개 테스트',
          price: 5000,
          tags: ['pub'],
          ownerId: u.id,
        },
      });

      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.some((p: any) => p.name === '공개상품')).toBe(true);
    });

    it('GET /products/:id 단건 조회', async () => {
      const token = await makeUserAndToken(owner);
      const created = await createProduct(token, productInput);

      const res = await request(app).get(`/products/${created.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.id);
      expect(res.body.name).toBe(productInput.name);
      // 비로그인 조회라도 구현에 따라 isLiked/likeCount가 포함될 수 있음(느슨히)
    });

    it('존재하지 않는 상품 조회 → 404(권장) 또는 500 등', async () => {
      const res = await request(app).get('/products/99999999');
      expect([404, 500]).toContain(res.status);
    });
  });

  // ---------- 보호(인증 필요) ----------
  describe('등록/수정/좋아요/삭제 (auth required)', () => {
    let ownerToken: string;
    let productId: number;

    beforeEach(async () => {
      ownerToken = await makeUserAndToken(owner);
    });

    it('POST /products 비로그인 → 401', async () => {
      const res = await request(app).post('/products').send(productInput);
      expect(res.status).toBe(401);
    });

    it('POST /products 로그인 후 생성 → 201/200', async () => {
      const res = await request(app).post('/products').set(auth(ownerToken)).send(productInput);
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('id');
    });

    it('PATCH /products/:id 가격 수정 → 200', async () => {
      const created = await createProduct(ownerToken, productInput);
      productId = created.id;

      const res = await request(app)
        .patch(`/products/${productId}`)
        .set(auth(ownerToken))
        .send({ price: 15000 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(15000);
    });

    it('POST /products/:id/like 다른 사용자 좋아요 → 204', async () => {
      const created = await createProduct(ownerToken, productInput);
      productId = created.id;

      const likerToken = await makeUserAndToken(liker);
      const res = await request(app).post(`/products/${productId}/like`).set(auth(likerToken));
      expect(res.status).toBe(204);

      // 좋아요 유저 목록 확인
      const resLikes = await request(app).get(`/products/${productId}/likes`);
      expect(resLikes.status).toBe(200);
      expect(Array.isArray(resLikes.body)).toBe(true);
      expect(resLikes.body.length).toBe(1);
      expect(resLikes.body[0].nickname).toBe(liker.nickname);

      // liker로 단건 조회 시 isLiked=true 기대(구현에 따라)
      const resDetail = await request(app)
        .get(`/products/${productId}`)
        .set(auth(likerToken));
      expect(resDetail.status).toBe(200);
      if ('isLiked' in resDetail.body) {
        expect(resDetail.body.isLiked).toBe(true);
      }
      if ('likeCount' in resDetail.body) {
        expect(resDetail.body.likeCount).toBeGreaterThanOrEqual(1);
      }
    });

    it('DELETE /products/:id/like 좋아요 취소 → 204', async () => {
      const created = await createProduct(ownerToken, productInput);
      productId = created.id;

      const likerToken = await makeUserAndToken(liker);
      await request(app).post(`/products/${productId}/like`).set(auth(likerToken));

      const res = await request(app).delete(`/products/${productId}/like`).set(auth(likerToken));
      expect(res.status).toBe(204);

      const resLikes = await request(app).get(`/products/${productId}/likes`);
      expect(resLikes.status).toBe(200);
      expect(resLikes.body.length).toBe(0);
    });

    it('DELETE /products/:id 소유자 삭제 → 204/200', async () => {
      const created = await createProduct(ownerToken, productInput);
      productId = created.id;

      const res = await request(app).delete(`/products/${productId}`).set(auth(ownerToken));
      expect([200, 204]).toContain(res.status);
    });

    it('PATCH /products/:id 비로그인 → 401', async () => {
      const created = await createProduct(ownerToken, productInput);
      const res = await request(app)
        .patch(`/products/${created.id}`)
        .send({ price: 12345 });
      expect(res.status).toBe(401);
    });
  });

  // ---------- 유효성 검증 ----------
  describe('유효성 검증', () => {
    it('name 누락 → 400', async () => {
      const token = await makeUserAndToken(owner);
      const res = await request(app)
        .post('/products')
        .set(auth(token))
        .send({
          // name: 누락
          price: 10000,
          tags: ['t'],
          imageUrl: 'https://picsum.photos/200',
        });
      expect(res.status).toBe(400);
    });

    it('price 누락 → 400', async () => {
      const token = await makeUserAndToken(owner);
      const res = await request(app)
        .post('/products')
        .set(auth(token))
        .send({
          name: '이름만',
          tags: ['t'],
          imageUrl: 'https://picsum.photos/200',
        });
      expect(res.status).toBe(400);
    });

    it('tags 누락 → 400', async () => {
      const token = await makeUserAndToken(owner);
      const res = await request(app)
        .post('/products')
        .set(auth(token))
        .send({
          name: '태그 없음',
          price: 10000,
          imageUrl: 'https://picsum.photos/200',
        });
      expect(res.status).toBe(400);
    });
  });
});