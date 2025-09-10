import request from "supertest";
import app from "../../src/app";
import { db } from "../../src/lib/db";
import TestAgent from "supertest/lib/agent";

let agent: TestAgent;
let articleId: number;
let accessToken: string;

beforeAll(async () => {
  await db.articleLike.deleteMany();
  await db.articleComment.deleteMany();
  await db.article.deleteMany();
  await db.productLike.deleteMany();
  await db.productComment.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();

  agent = request.agent(app);

  await agent.post("/auth/register").send({
    email: "test@test.com",
    password: "test123",
    nickname: "tester",
  });

  const loginRes = await agent.post("/auth/login").send({
    email: "test@test.com",
    password: "test123",
  });

  expect(loginRes.status).toBe(200);
  accessToken = loginRes.body.accesstoken;
});

afterAll(async () => {
  await db.$disconnect();
});

describe("Article API", () => {
  test("게시글 작성 성공", async () => {
    const res = await agent
      .post("/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "테스트 글",
        content: "테스트 본문",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("게시글이 등록되었습니다.");
    expect(res.body.articleId).toBeTruthy();

    articleId = res.body.articleId;
  });

  test("인증 없이 게시글 작성 시 401 반환", async () => {
    const res = await request(app)
      .post("/articles")
      .send({
        title: "인증 실패 글",
        content: "토큰 없음",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toEqual("인증이 필요합니다.");
  });

  test("게시글 목록 조회", async () => {
    const res = await agent.get("/articles");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("게시글 목록 조회 성공");
    expect(res.body.articles).toBeTruthy();
  });

  test("게시글 단일 조회", async () => {
    const res = await agent
      .get(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.article).toBeTruthy();
  });

  test("게시글 수정", async () => {
    const res = await agent
      .patch(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "수정된 글",
        content: "수정된 본문",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("게시글이 수정되었습니다.");
  });

  test("게시글 좋아요 토글", async () => {
    const res = await agent
      .post(`/articles/${articleId}/like`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status === 200 || res.status === 201).toBeTruthy();
    expect(res.body.liked === true || res.body.liked === false).toBeTruthy();
  });

  test("게시글 삭제", async () => {
    const res = await agent
      .delete(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("게시글이 삭제되었습니다.");
  });
});
