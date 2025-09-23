// src/tests/integration/products.auth.test.ts
import request from 'supertest';
import { app, prisma, stop } from '../../main';

afterAll(async () => {
  await stop(); // 서버/DB 커넥션 정리
});

beforeEach(async () => {
  // 테스트 격리: 알림/댓글 등이 있다면 먼저 정리 후 상품 정리
  await prisma.notification?.deleteMany?.().catch(() => {});
  await prisma.comment?.deleteMany?.().catch(() => {});
  await prisma.product.deleteMany();
});

describe('상품 API (인증 필요)', () => {
  it('POST /products → 201, 상품 생성', async () => {
    const body = {
      name: '테스트 상품',
      description: '설명',
      price: 15000,
      tags: ['소품'],
      images: ['https://picsum.photos/200/300'],
    };

    const res = await request(app).post('/products').send(body);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(body.name);
    expect(res.body.description).toBe(body.description);
    expect(res.body.price).toBe(body.price);

    // DB 확인 (userId가 주입되어 저장되는지까지 체크)
    const created = await prisma.product.findUnique({ where: { id: res.body.id } });
    expect(created).not.toBeNull();
    expect(created?.userId).toBeDefined();
  });

  it('PATCH /products/:id → 200, 상품 수정(설명/가격 변경)', async () => {
    // 사전 생성
    const user =
      (await prisma.user.findFirst({ select: { id: true } })) ??
      (await prisma.user.create({
        data: { email: 'test@example.com', nickname: 'test', password: 'test' },
        select: { id: true },
      }));

    const created = await prisma.product.create({
      data: {
        userId: user.id,
        name: '수정대상',
        description: 'old',
        price: 1000,
        tags: [],
        images: [],
      },
      select: { id: true },
    });

    const patch = {
      name: '수정대상', // 이름 유지
      description: 'new-desc',
      price: 2000,
      tags: [],
      images: [],
    };

    const res = await request(app).patch(`/products/${created.id}`).send(patch);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id', created.id);
    expect(res.body.description).toBe(patch.description);
    expect(res.body.price).toBe(patch.price);

    // DB 확인
    const after = await prisma.product.findUnique({ where: { id: created.id } });
    expect(after?.description).toBe(patch.description);
    expect(after?.price).toBe(patch.price);
  });

  it('DELETE /products/:id → 200/204, 상품 삭제', async () => {
    // 사전 생성
    const user =
      (await prisma.user.findFirst({ select: { id: true } })) ??
      (await prisma.user.create({
        data: { email: 'test@example.com', nickname: 'test', password: 'test' },
        select: { id: true },
      }));

    const created = await prisma.product.create({
      data: {
        userId: user.id,
        name: '삭제대상',
        description: '삭제',
        price: 500,
        tags: [],
        images: [],
      },
      select: { id: true },
    });

    const res = await request(app).delete(`/products/${created.id}`);

    expect([200, 204]).toContain(res.status);

    const found = await prisma.product.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });
});
