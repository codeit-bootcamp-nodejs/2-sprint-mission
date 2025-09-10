import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/testUtils';

describe('게시글 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증이 필요없는 API', () => {
    describe('GET /articles', () => {
      beforeEach(async () => {
        const user = await prismaClient.user.create({
          data: {
            email: 'test@example.com',
            password: 'hashedpassword',
            nickname: 'Test User',
          },
        });

        // 테스트 용 게시글 20개 생성
        for (let i = 0; i < 20; i++) {
          await prismaClient.article.create({
            data: {
              title: `Test Article ${i}`,
              content: 'Test Content',
              userId: user.id,
              createdAt: new Date(Date.now() + i * 1000),
            },
          });
        }
      });

      test('모든 게시글을 조회할 수 있다', async () => {
        const response = await request(app).get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(20);
        expect(response.body.list[0].title).toBe('Test Article 0');
        expect(response.body.list[9].title).toBe('Test Article 9');
      });

      test('페이지네이션을 적용할 수 있다', async () => {
        const response = await request(app).get('/articles?page=2&pageSize=10');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(20);
        expect(response.body.list[0].title).toBe('Test Article 10');
        expect(response.body.list[9].title).toBe('Test Article 19');
      });

      test('키워드를 검색할 수 있다', async () => {
        const response = await request(app).get('/articles?keyword=2');
        expect(response.status).toBe(200);
        // 2, 12 총 2개의 게시글이 검색되어야 한다.
        expect(response.body.list.length).toBe(2);
        expect(response.body.totalCount).toBe(2);
        expect(response.body.list[0].title).toBe('Test Article 2');
        expect(response.body.list[1].title).toBe('Test Article 12');
      });

      test('최신순으로 정렬할 수 있다', async () => {
        const response = await request(app).get('/articles?orderBy=recent');
        expect(response.status).toBe(200);
        expect(response.body.list[0].title).toBe('Test Article 19');
        expect(response.body.list[9].title).toBe('Test Article 10');
      });
    });

    describe('GET /articles/:id', () => {
      test('게시글이 존재할 때 200과 게시글 상세 정보를 반환해야 한다', async () => {
        // 테스트용 사용자 생성
        const user = await prismaClient.user.create({
          data: {
            email: 'test@example.com',
            password: 'hashedpassword',
            nickname: 'Test User',
          },
        });

        // 테스트용 게시글 생성
        const article = await prismaClient.article.create({
          data: {
            title: 'Test Article',
            content: 'Test Content',
            userId: user.id,
          },
        });

        const response = await request(app).get(`/articles/${article.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          id: article.id,
          title: 'Test Article',
          content: 'Test Content',
          userId: user.id,
          likeCount: 0,
        });
      });

      test('게시글이 존재하지 않을 때 404를 반환해야 한다', async () => {
        const nonExistentId = 9999;
        const response = await request(app).get(`/articles/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('인증이 필요한 API', () => {
    describe('POST /articles', () => {
      test('인증되지 않은 사용자가 게시글을 생성할 때 401을 반환해야 한다', async () => {
        const response = await request(app).post('/articles');
        expect(response.status).toBe(401);
      });

      test('인증된 사용자가 게시글을 생성할 때 201을 반환해야 한다', async () => {
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

        const articlePayload = {
          title: 'Test Article',
          content: 'Test Content',
          image: 'test.jpg',
        };

        const response = await agent.post('/articles').send(articlePayload);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          title: 'Test Article',
          content: 'Test Content',
          image: 'test.jpg',
        });
      });

      test('잘못된 payload로 게시글 생성 시 400을 반환해야 한다', async () => {
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
          {
            // title이 빈 문자열
            title: '',
            content: 'Test Content',
            image: 'test.jpg',
          },
          {
            // title이 없음
            content: 'Test Content',
            image: 'test.jpg',
          },
          {
            // content가 없음
            title: 'Test Title',
            image: 'test.jpg',
          },
          {
            // content가 빈 문자열
            title: 'Test Title',
            content: '',
            image: 'test.jpg',
          }
        ];

        for (const payload of invalidPayloads) {
          const response = await agent.post('/articles').send(payload);
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('message');
        }
      });
    });
  });
});
