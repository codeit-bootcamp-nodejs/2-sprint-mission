import request from 'supertest';
import { app, prisma, stop } from '../../main';

afterAll(async () => {
  await stop();
});

beforeEach(async () => {
  await prisma.comment?.deleteMany?.().catch(() => {});
  await prisma.product.deleteMany();
  await prisma.user.deleteMany(); // ✅ 유저 초기화
});

describe('상품 공개 API', () => {
  it('GET /products → 200 & 배열 반환', async () => {
    // ✅ 유저 보장
    const user =
      (await prisma.user.findFirst({ select: { id: true } })) ??
      (await prisma.user.create({
        data: {
          email: 'test@example.com',
          nickname: 'test',
          password: 'test',
        },
        select: { id: true },
      }));

    // 샘플 상품 생성
    await prisma.product.create({
      data: {
        userId: user.id, // ✅ 실제 존재하는 유저 ID
        name: '테스트상품',
        description: '설명',
        price: 1000,
        tags: [],
        images: [],
      },
    });

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const item = res.body[0];
    expect(typeof item.id).toBe('number');
    expect(typeof item.name).toBe('string');
    expect(typeof item.price).toBe('number');
  });
});
