require('dotenv').config({ path: '.env.test' });

import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

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

describe('Auth 통합 테스트 (회원가입/로그인)', () => {
  const email = 'user1@example.com';
  const password = 'pass1234';
  const nickname = 'user1';

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /auth/register → 201 (성공)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, nickname });

    expect([200, 201]).toContain(res.status);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).toHaveProperty('nickname', nickname);
  });

  it('POST /auth/register → 400 (필수값 누락)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({ email, password }); // nickname 누락

    expect(res.status).toBe(400);
   
    expect(res.body).toHaveProperty('message');
  });

  it('POST /auth/register → 409 (중복 이메일/닉네임)', async () => {
    await request(app).post('/auth/register').send({ email, password, nickname });
    const res = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, nickname });

    expect(res.status).toBe(409);
  
  });

  it('POST /auth/login → 200 + accessToken (성공)', async () => {
    await request(app).post('/auth/register').send({ email, password, nickname });

    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(typeof res.body.accessToken).toBe('string');
   
    const setCookie = (res.headers['set-cookie'] as unknown as string[] | undefined) ?? [];
    const hasRefresh = setCookie.some((c) => c.includes('refreshToken='));
    expect(hasRefresh).toBe(true);
  });

  it('POST /auth/login → 401 (잘못된 비밀번호)', async () => {
    await request(app).post('/auth/register').send({ email, password, nickname });

    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password: 'wrongpw' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /auth/login → 401 (없는 이메일)', async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'nouser@example.com', password });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /auth/token → 200 + 새 accessToken (리프레시 토큰로 재발급)', async () => {
    
    const agent = request.agent(app);
    await agent.post('/auth/register').send({ email, password, nickname });
    const loginRes = await agent.post('/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    

    const tokenRes = await agent.post('/auth/token').send();
    expect(tokenRes.status).toBe(200);
    expect(typeof tokenRes.body.accessToken).toBe('string');
  });
});