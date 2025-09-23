import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import { createTestApp, createTestUser } from '../utils/testHelpers';

describe('Auth API', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: faker.internet.email(),
        nickname: faker.person.firstName(),
        password: faker.internet.password({ length: 10 }),
        image: faker.image.avatar(),
      };

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.nickname).toBe(userData.nickname);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        email: faker.internet.email(),
        nickname: faker.person.firstName(),
        password: faker.internet.password(),
        image: null,
      };

      // 첫 번째 등록
      await request(app).post('/auth/register').send(userData);

      // 동일한 이메일로 재등록 시도
      const response = await request(app).post('/auth/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        email: '',
        nickname: '',
        password: '',
        image: null,
      };

      const response = await request(app).post('/auth/register').send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const password = faker.internet.password();
      const { user } = await createTestUser({
        password: await require('bcrypt').hash(password, 10),
      });

      const response = await request(app).post('/auth/login').send({
        email: user.email,
        password: password,
      });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();

      const cookies = response.headers['set-cookie'];
      expect(cookies[0]).toContain('access-token');
      expect(cookies[1]).toContain('refresh-token');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/auth/login').send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for invalid password', async () => {
      const { user } = await createTestUser();

      const response = await request(app).post('/auth/login').send({
        email: user.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear auth cookies', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(200);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('access-token=;');
      expect(cookies[1]).toContain('refresh-token=;');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const { user, password } = await createTestUser();

      // 로그인하여 토큰 발급
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password });

      const cookies = loginResponse.headers['set-cookie'] as unknown as string[];
      // refresh-token이 두 번째 쿠키라고 가정
      let refreshToken = '';
      cookies.forEach((cookie) => {
        if (cookie.includes('refresh-token=')) {
          refreshToken = cookie.split('refresh-token=')[1].split(';')[0];
        }
      });

      // 토큰 갱신
      const response = await request(app)
        .post('/auth/refresh')
        .set('Cookie', `refresh-token=${refreshToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();

      const newCookies = response.headers['set-cookie'];
      expect(newCookies[0]).toContain('access-token');
      expect(newCookies[1]).toContain('refresh-token');
    });

    it('should return 400 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .set('Cookie', 'refresh-token=invalid_token');

      expect(response.status).toBe(400);
    });

    it('should return 400 when refresh token is missing', async () => {
      const response = await request(app).post('/auth/refresh');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid refresh token');
    });
  });
});
