// src/tests/integration/auth.test.ts
import request from 'supertest';
import { app, prisma, stop } from '../../main';

afterAll(async () => {
  await stop(); // 서버/DB 커넥션 정리
});

describe('임시 인증 미들웨어', () => {
  beforeEach(async () => {
    // 유저 테이블 초기화 (주의: 다른 테스트와 격리 목적)
    await prisma.notification?.deleteMany?.().catch(() => {});
    await prisma.comment?.deleteMany?.().catch(() => {});
    await prisma.article?.deleteMany?.().catch(() => {});
    await prisma.product?.deleteMany?.().catch(() => {});
    await prisma.user.deleteMany();
  });

  it('요청 시 유저가 없으면 생성하고 req.user를 주입한다', async () => {
    // 사전: 유저 0명이어야 함
    const beforeCount = await prisma.user.count();
    expect(beforeCount).toBe(0);

    // 어떤 엔드포인트든 호출하면(예: /) 미들웨어가 유저를 생성해서 주입함
    const res = await request(app).get('/');

    expect(res.status).toBe(200);

    const afterCount = await prisma.user.count();
    expect(afterCount).toBe(1); // 1명 생성되었는지
  });

  it('이미 유저가 있으면 새로 만들지 않고 그대로 사용한다 (중복생성 방지)', async () => {
    // 첫 요청: 유저 생성
    await request(app).get('/').expect(200);

    const countAfterFirst = await prisma.user.count();
    expect(countAfterFirst).toBe(1);

    // 두 번째 요청: 기존 유저 재사용 → 여전히 1명이어야 함
    await request(app).get('/').expect(200);

    const countAfterSecond = await prisma.user.count();
    expect(countAfterSecond).toBe(1);
  });
});

