import request from 'supertest';
import app from '../app';
import { db } from '../utils/db';
import bcrypt from 'bcrypt';

let testUser: any;
let authCookies: string;

const createTestUserAndLogin = async () => {
  const hashedPassword = await bcrypt.hash('test123', 10);

  testUser = await db.user.create({
    data: {
      email: 'test@example.com',
      nickname: '테스트유저',
      password: hashedPassword,
    },
  });

  const loginRes = await request(app).post('/auth/login').send({
    email: 'test@example.com',
    password: 'test123',
  });

  if (loginRes.statusCode !== 200) {
    throw new Error('로그인 실패');
  }

  authCookies = loginRes.headers['set-cookie'];
};

beforeEach(async () => {
  await db.product.deleteMany();
  await db.user.deleteMany();
});

describe('POST /products - 상품 등록', () => {
  beforeEach(async () => {
    await createTestUserAndLogin();
  });

  it('인증된 사용자가 상품을 등록할 수 있다', async () => {
    const productData = {
      name: '테스트 상품',
      description: '테스트 설명',
      price: 10000,
      tags: ['태그1', '태그2'],
      imageUrl: 'test.jpg',
    };

    const res = await request(app)
      .post('/products')
      .set('Cookie', authCookies)
      .send(productData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('상품이 등록되었습니다.');
    expect(res.body.newProduct.userId).toBe(testUser.id);
  });

  it('인증되지 않은 사용자는 상품을 등록할 수 없다', async () => {
    const res = await request(app).post('/products').send({
      name: '상품',
      description: '설명',
      price: 10000,
      tags: ['태그'],
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('액세스 토큰이 없습니다.');
  });

  it('필수 필드 누락 시 400 반환', async () => {
    const res = await request(app)
      .post('/products')
      .set('Cookie', authCookies)
      .send({ name: '상품' });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /products - 상품 목록', () => {
  beforeEach(async () => {
    await createTestUserAndLogin();

    await db.product.createMany({
      data: [
        {
          name: '첫 번째 상품',
          description: '설명1',
          price: 10000,
          tags: ['태그1'],
          imageUrl: 'a.jpg',
          userId: testUser.id,
        },
        {
          name: '두 번째 상품',
          description: '설명2',
          price: 20000,
          tags: ['태그2'],
          imageUrl: 'b.jpg',
          userId: testUser.id,
        },
      ],
    });
  });

  it('상품 목록을 조회할 수 있다', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('검색어로 필터링할 수 있다', async () => {
    const res = await request(app).get('/products?search=첫');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toContain('첫');
  });

  it('페이지네이션 동작 확인', async () => {
    const res = await request(app).get('/products?limit=1&offset=0');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe('GET /products/:id - 상품 상세 조회', () => {
  let testProduct: any;

  beforeEach(async () => {
    await createTestUserAndLogin();

    testProduct = await db.product.create({
      data: {
        name: '상세 상품',
        description: '상세 설명',
        price: 10000,
        tags: ['태그'],
        imageUrl: 'detail.jpg',
        userId: testUser.id,
      },
    });
  });

  it('상품 상세 정보를 조회할 수 있다', async () => {
    const res = await request(app).get(`/products/${testProduct.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testProduct.name);
  });

  it('존재하지 않는 상품은 404 반환', async () => {
    const res = await request(app).get('/products/9999');
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /products/:id - 상품 수정', () => {
  let testProduct: any;

  beforeEach(async () => {
    await createTestUserAndLogin();

    testProduct = await db.product.create({
      data: {
        name: '원본 상품',
        description: '원본 설명',
        price: 10000,
        tags: ['태그'],
        imageUrl: 'edit.jpg',
        userId: testUser.id,
      },
    });
  });

  it('상품 등록자가 상품을 수정할 수 있다', async () => {
    const res = await request(app)
      .patch(`/products/${testProduct.id}`)
      .set('Cookie', authCookies)
      .send({ name: '수정된 이름', price: 20000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('수정된 이름');
  });

  it('인증되지 않은 사용자는 401 반환', async () => {
    const res = await request(app).patch(`/products/${testProduct.id}`).send({
      name: '해킹시도',
    });

    expect(res.statusCode).toBe(401);
  });

  it('다른 사용자의 상품은 수정할 수 없다', async () => {
    const otherUser = await db.user.create({
      data: {
        email: 'other@example.com',
        nickname: '다른유저',
        password: await bcrypt.hash('test123', 10),
      },
    });

    const otherProduct = await db.product.create({
      data: {
        name: '다른 상품',
        description: '다른 설명',
        price: 10000,
        tags: ['태그'],
        imageUrl: 'other.jpg',
        userId: otherUser.id,
      },
    });

    const res = await request(app)
      .patch(`/products/${otherProduct.id}`)
      .set('Cookie', authCookies)
      .send({ name: '변경 시도' });

    expect(res.statusCode).toBe(401);
  });
});

describe('DELETE /products/:id - 상품 삭제', () => {
  let testProduct: any;

  beforeEach(async () => {
    await createTestUserAndLogin();

    testProduct = await db.product.create({
      data: {
        name: '삭제 상품',
        description: '삭제 설명',
        price: 10000,
        tags: ['태그'],
        imageUrl: 'delete.jpg',
        userId: testUser.id,
      },
    });
  });

  it('등록자가 상품을 삭제할 수 있다', async () => {
    const res = await request(app)
      .delete(`/products/${testProduct.id}`)
      .set('Cookie', authCookies);

    expect(res.statusCode).toBe(204);
  });

  it('비인증자는 삭제할 수 없다', async () => {
    const res = await request(app).delete(`/products/${testProduct.id}`);
    expect(res.statusCode).toBe(401);
  });

  it('다른 사용자는 삭제할 수 없다', async () => {
    const otherUser = await db.user.create({
      data: {
        email: 'other@example.com',
        nickname: '다른유저',
        password: await bcrypt.hash('test123', 10),
      },
    });

    const otherProduct = await db.product.create({
      data: {
        name: '타인 상품',
        description: '타인 설명',
        price: 20000,
        tags: ['태그'],
        imageUrl: 'other.jpg',
        userId: otherUser.id,
      },
    });

    const res = await request(app)
      .delete(`/products/${otherProduct.id}`)
      .set('Cookie', authCookies);

    expect(res.statusCode).toBe(401);
  });
});