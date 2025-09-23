import request from 'supertest';
import { app, prisma, stop } from '../../main';

afterAll(async () => {
  await stop(); // 서버/DB 커넥션 정리
});

beforeEach(async () => {
  // 테스트 격리: 댓글 → 게시글 순으로 초기화
  await prisma.comment?.deleteMany?.().catch(() => {});
  await prisma.article.deleteMany();
});

describe('게시글 API (인증 필요)', () => {
  it('POST /articles → 201, 게시글 생성', async () => {
    const body = {
      title: '테스트 게시글',
      content: '테스트 내용',
      image: 'https://picsum.photos/200',
    };

    const res = await request(app).post('/articles').send(body);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(body.title);
    expect(res.body.content).toBe(body.content);

    const created = await prisma.article.findUnique({ where: { id: res.body.id } });
    expect(created).not.toBeNull();
  });

  it('PATCH /articles/:id → 200, 게시글 수정', async () => {
    const user =
      (await prisma.user.findFirst({ select: { id: true } })) ??
      (await prisma.user.create({
        data: { email: 'test@example.com', nickname: 'test', password: 'test' },
        select: { id: true },
      }));

    const created = await prisma.article.create({
      data: {
        userId: user.id,
        title: '수정 전 제목',
        content: '수정 전 내용',
      },
      select: { id: true },
    });

    const patch = {
      title: '수정 후 제목',
      content: '수정 후 내용',
    };

    const res = await request(app).patch(`/articles/${created.id}`).send(patch);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id', created.id);
    expect(res.body.title).toBe(patch.title);
    expect(res.body.content).toBe(patch.content);

    const after = await prisma.article.findUnique({ where: { id: created.id } });
    expect(after?.title).toBe(patch.title);
    expect(after?.content).toBe(patch.content);
  });

  it('DELETE /articles/:id → 200/204, 게시글 삭제', async () => {
    const user =
      (await prisma.user.findFirst({ select: { id: true } })) ??
      (await prisma.user.create({
        data: { email: 'test@example.com', nickname: 'test', password: 'test' },
        select: { id: true },
      }));

    const created = await prisma.article.create({
      data: {
        userId: user.id,
        title: '삭제될 글',
        content: '삭제될 내용',
      },
      select: { id: true },
    });

    const res = await request(app).delete(`/articles/${created.id}`);

    expect([200, 204]).toContain(res.status);

    const found = await prisma.article.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });
});
