import app from '../app';
import request from 'supertest';
import { db } from '../utils/db';

// 인증이 필요하지 않은 상품 api test

// 상품 상세조회
describe("GET /product/detail/:id", () => {
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    await db.article.deleteMany({});
    await db.product.deleteMany({});
    await db.user.deleteMany({});

    const user = await db.user.create({
      data: {
        email: 'test',
        nickname: 'test',
        password: 'test'
      }
    });
    userId = user.id;
    const product = await db.product.create({
      data: {
        userId,
        name: 'test',
        description: 'test',
        price: 1000,
        tags: ['test']
      }
    })
    productId = product.id;
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  test("존재하지 않는 상품으로 상세 조회할 경우", async () => {
    const response = await request(app).get(`/product/detail/${productId + 1}`)
    expect(response.statusCode).toBe(404);
  });

  test("정상적인 상품 상세 조회", async () => {
    const response = await request(app).get(`/product/detail/${productId}`)
    expect(response.statusCode).toBe(200);
  });

});

//  상품 목록 조회
describe("GET /product/list", () => {

  let userId: number;
  let productId: number;

  beforeAll(async () => {
    await db.product.deleteMany({});
    await db.user.deleteMany({});

    const user = await db.user.create({
      data: {
        email: 'test',
        nickname: 'test',
        password: 'test'
      }
    });
    userId = user.id;
    const product = await db.product.create({
      data: {
        userId,
        name: 'test',
        description: 'test',
        price: 1000,
        tags: ['test']
      }
    })
    productId = product.id;
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  test("정상적인 상품 목록 조회", async () => {
    const response = await request(app)
      .get(`/product/list`)
      .query({
        offset: 0,
        limit: 10,
        order: 'newest'
      });
    expect(response.statusCode).toBe(200);
  });
});

