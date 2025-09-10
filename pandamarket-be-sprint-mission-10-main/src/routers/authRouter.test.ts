import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/testUtils';

describe('인증 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('POST /auth/register', () => {
    test('새로운 사용자를 등록할 수 있다', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'Test User',
        image: 'test.jpg',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: userData.email,
        nickname: userData.nickname,
        image: userData.image,
      });
    });

    test('이미 존재하는 이메일로 회원가입 시 400을 반환해야 한다', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'Test User',
        image: 'test.jpg',
      };

      // 첫 번째 회원가입
      await request(app).post('/auth/register').send(userData);

      // 동일한 이메일로 두 번째 회원가입 시도
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    test('잘못된 payload로 회원가입 시 400을 반환해야 한다', async () => {
      const invalidPayloads = [
        {
          // email이 없음
          password: 'password123',
          nickname: 'Test User',
          image: 'test.jpg',
        },
        {
          // email이 빈 문자열
          email: '',
          password: 'password123',
          nickname: 'Test User',
          image: 'test.jpg',
        },
        {
          // password가 없음
          email: 'test@example.com',
          nickname: 'Test User',
          image: 'test.jpg',
        },
        {
          // password가 빈 문자열
          email: 'test@example.com',
          password: '',
          nickname: 'Test User',
          image: 'test.jpg',
        },
        {
          // nickname이 없음
          email: 'test@example.com',
          password: 'password123',
          image: 'test.jpg',
        },
        {
          // nickname이 빈 문자열
          email: 'test@example.com',
          password: 'password123',
          nickname: '',
          image: 'test.jpg',
        },
      ];

      for (const payload of invalidPayloads) {
        const response = await request(app)
          .post('/auth/register')
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
      }
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // 테스트용 사용자 생성
      await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        nickname: 'Test User',
        image: 'test.jpg',
      });
    });

    test('올바른 이메일과 비밀번호로 로그인할 수 있다', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token='),
          expect.stringContaining('refresh-token='),
        ])
      );
    });

    test('잘못된 비밀번호로 로그인 시 400을 반환해야 한다', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    test('존재하지 않는 이메일로 로그인 시 400을 반환해야 한다', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/logout', () => {
    test('로그아웃할 수 있다', async () => {
      const agent = request.agent(app);

      // 회원가입
      await agent.post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        nickname: 'Test User',
        image: 'test.jpg',
      });

      // 로그인
      await agent.post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      // 로그아웃
      const response = await agent.post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token=;'),
          expect.stringContaining('refresh-token=;'),
        ])
      );
    });
  });

  describe('POST /auth/refresh', () => {
    test('리프레시 토큰으로 새로운 액세스 토큰을 발급받을 수 있다', async () => {
      const agent = request.agent(app);

      // 회원가입
      await agent.post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        nickname: 'Test User',
        image: 'test.jpg',
      });

      // 로그인
      await agent.post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      // 토큰 갱신
      const response = await agent.post('/auth/refresh');

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token='),
          expect.stringContaining('refresh-token='),
        ])
      );
    });

    test('리프레시 토큰이 없을 때 400을 반환해야 한다', async () => {
      const response = await request(app).post('/auth/refresh');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});
