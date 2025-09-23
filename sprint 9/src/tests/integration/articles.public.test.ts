import request from 'supertest';
import { app, prisma, stop } from '../../main';

afterAll(async () => {
  await stop();
});

beforeEach(async () => {
  await prisma.comment?.deleteMany?.().catch(() => {});
  await prisma.article.deleteMany();
  await prisma.user.deleteMany(); // ✅ 유저 초기화
});

describe('게시글 공개 API', () => {
  it('GET /articles → 200 & 배열 반환', async () => {
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

    // 샘플 게시글 생성
    await prisma.article.create({
      data: {
        title: '테스트 제목',
        content: '테스트 내용',
        userId: user.id, // ✅ 실제 존재하는 유저 ID
      },
    });

    const res = await request(app).get('/articles');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const item = res.body[0];
    expect(typeof item.id).toBe('number');
    expect(typeof item.title).toBe('string');
  });
});
