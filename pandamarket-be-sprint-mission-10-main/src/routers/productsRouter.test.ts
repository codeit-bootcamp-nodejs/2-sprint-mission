import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/testUtils';

describe('상품 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });


  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증이 필요없는 API', () => {
    describe('GET /products', () => {
      beforeEach(async () => {
        const user = await prismaClient.user.create({
          data: {
            email: 'test@example.com',
            password: 'hashedpassword',
            nickname: 'Test User',
          },
        });

        // 테스트 용 상품 20개 생성
        for (let i = 0; i < 20; i++) {
          await prismaClient.product.create({
            data: {
              name: `Test Product ${i}`,
              description: 'Test Description',
              price: 10000,
              userId: user.id,
              tags: ['test', 'product'],
              images: ['test.jpg', 'test2.jpg'],
              createdAt: new Date(Date.now() + i * 1000),
            },
          });
        }
      });

      test('모든 상품을 조회할 수 있다', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(20);
        expect(response.body.list[0].name).toBe('Test Product 0');
        expect(response.body.list[9].name).toBe('Test Product 9');
      });

      test('페이지네이션을 적용할 수 있다', async () => {
        const response = await request(app).get('/products?page=2&pageSize=10');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(20);
        expect(response.body.list[0].name).toBe('Test Product 10');
        expect(response.body.list[9].name).toBe('Test Product 19');
      });

      test('키워드를 검색할 수 있다', async () => {
        const response = await request(app).get('/products?keyword=2');
        expect(response.status).toBe(200);
        // 2, 12 총 2개의 상품이 검색되어야 한다.
        expect(response.body.list.length).toBe(2);
        expect(response.body.totalCount).toBe(2);
        expect(response.body.list[0].name).toBe('Test Product 2');
        expect(response.body.list[1].name).toBe('Test Product 12');
      });

      test('최신순으로 정렬할 수 있다', async () => {
        const response = await request(app).get('/products?orderBy=recent');
        expect(response.status).toBe(200);
        expect(response.body.list[0].name).toBe('Test Product 19');
        expect(response.body.list[9].name).toBe('Test Product 10');
      });
    });

    describe('GET /products/:id', () => {
      test('상품이 존재할 때 200과 상품 상세 정보를 반환해야 한다', async () => {
        // 테스트용 사용자 생성
        const user = await prismaClient.user.create({
          data: {
            email: 'test@example.com',
            password: 'hashedpassword',
            nickname: 'Test User',
          },
        });

        // 테스트용 상품 생성
        const product = await prismaClient.product.create({
          data: {
            name: 'Test Product',
            description: 'Test Description',
            price: 10000,
            userId: user.id,
            tags: ['test', 'product'],
            images: ['test.jpg', 'test2.jpg'],
          },
        });

        const response = await request(app).get(`/products/${product.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          id: product.id,
          name: 'Test Product',
          description: 'Test Description',
          price: 10000,
          tags: ['test', 'product'],
          images: ['test.jpg', 'test2.jpg'],
          userId: user.id,
          favoriteCount: 0,
        });
      });

      test('상품이 존재하지 않을 때 404를 반환해야 한다', async () => {
        const nonExistentId = 9999;
        const response = await request(app).get(`/products/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('인증이 필요한 API', () => {
    describe('POST /products', () => {
      test('인증되지 않은 사용자가 상품을 생성할 때 401을 반환해야 한다', async () => {
        const response = await request(app).post('/products');
        expect(response.status).toBe(401);
      });

      test('인증된 사용자가 상품을 생성할 때 201을 반환해야 한다', async () => {
        const agent = request.agent(app);
  
        await agent.post('/auth/register').send({
          email: 'test@example.com',
          password: 'password',
          nickname: 'Test User',
          image: 'test.jpg',
        });
        await agent.post('/auth/login').send({
          email: 'test@example.com',
          password: 'password',
        });
        
        const productPayload = {
          name: 'Test Product',
          description: 'Test Description',
          price: 10000,
          tags: ['test', 'product'],
          images: ['test.jpg', 'test2.jpg'],
        };

        const response = await agent.post('/products').send(productPayload);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          name: 'Test Product',
          description: 'Test Description',
          price: 10000,
          tags: ['test', 'product'],
          images: ['test.jpg', 'test2.jpg'],
        });
      });

      test('잘못된 payload로 상품 생성 시 400을 반환해야 한다', async () => {
        const agent = request.agent(app);
        await agent.post('/auth/register').send({
          email: 'test@example.com',
          password: 'password',
          nickname: 'Test User',
          image: 'test.jpg',
        });

        await agent.post('/auth/login').send({
          email: 'test@example.com',
          password: 'password',
        });

        const invalidPayloads = [
          // name이 빈 문자열
          {
            name: '',
            description: 'Test Description',
            price: 10000,
            tags: ['test', 'product'],
            images: ['test.jpg', 'test2.jpg'],
          },
          // name이 없음
          {
            description: 'Test Description',
            price: 10000,
            tags: ['test', 'product'],
            images: ['test.jpg', 'test2.jpg'],
          },
          // description이 빈 문자열
          {
            name: 'Test Product',
            description: '',
            price: 10000,
            tags: ['test', 'product'],
            images: ['test.jpg', 'test2.jpg'],
          },
          // description이 없음
          {
            name: 'Test Product',
            price: 10000,
            tags: ['test', 'product'],
            images: ['test.jpg', 'test2.jpg'],
          },
          // price가 없음
          {
            name: 'Test Product',
            description: 'Test Description',
            tags: ['test', 'product'],
            images: ['test.jpg', 'test2.jpg'],
          },
          // tags가 없음
          {
            name: 'Test Product',
            description: 'Test Description',
            price: 10000,
            images: ['test.jpg', 'test2.jpg'],
          },
          // images가 없음
          {
            name: 'Test Product',
            description: 'Test Description',
            price: 10000,
            tags: ['test', 'product'],
          }
        ];
        for (const payload of invalidPayloads) {
          const response = await agent.post('/products').send(payload);
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('message');
        }
      });
    });
  });
});
