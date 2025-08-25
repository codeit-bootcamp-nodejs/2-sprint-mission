require("dotenv").config({ path: ".env.test" });

import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app";

const testDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

type Agent = ReturnType<typeof request.agent>;

describe("게시글(articles)", () => {
  const userA = {
    email: "a@example.com",
    nickname: "userA",
    password: "pw1234",
  };
  const userB = {
    email: "b@example.com",
    nickname: "userB",
    password: "pw1234",
  };

  const articleInput = {
    title: "테스트 제목",
    content: "테스트 본문",
    tags: ["tag1", "tag2"],
  };

  beforeAll(async () => {
    await testDb.$connect();
  });

  beforeEach(async () => {
    await testDb.user.deleteMany();
    await testDb.product.deleteMany();
    await testDb.article.deleteMany();
    await testDb.productComment.deleteMany();
    await testDb.articleComment.deleteMany();
    await testDb.productLike.deleteMany();
    await testDb.articleLike.deleteMany();
    await testDb.notify.deleteMany();
  });

  afterAll(async () => {
    await testDb.user.deleteMany().catch(() => {});
    await testDb.$disconnect();
  });

  // helpers
  const makeAgentAndLogin = async (user: typeof userA): Promise<Agent> => {
    const agent = request.agent(app);
    await request(app).post("/api/auth/register").send(user);
    const response = await agent.post("/api/auth/login").send(user);
    expect(response.status).toBe(200);
    return agent;
  };

  const createArticle = async (agent: Agent, body = articleInput) => {
    const response = await agent.post("/api/articles").send(body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "작성 완료");
    expect(response.body).toHaveProperty("result");
    return response.body.result;
  };

  describe("게시글 조회", () => {
    it("GET /api/articles", async () => {
      const agent = await makeAgentAndLogin(userA);
      await createArticle(agent);

      const response = await request(app).get("/api/articles");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "조회 완료");
      expect(response.body).toHaveProperty("result");
      expect(Array.isArray(response.body.result)).toBe(true);
      expect(response.body.result.length).toBeGreaterThanOrEqual(1);
    });

    it("GET /api/articles/:id", async () => {
      const agent = await makeAgentAndLogin(userA);
      const created = await createArticle(agent);

      const response = await request(app).get(`/api/articles/${created.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "조회 완료");
      expect(response.body).toHaveProperty("result");
      expect(response.body.result.id).toBe(created.id);
    });

    it("존재하지 않는 게시글", async () => {
      const response = await request(app).get(`/api/articles/9999999`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("success");
    });
  });

  describe("게시글 등록,수정,삭제", () => {
    it("POST /api/articles - 비로그인 401", async () => {
      const response = await request(app).post("/api/articles").send(articleInput);
      expect(response.statusCode).toBe(401);
    });

    it("POST /api/articles - 로그인 후 생성 201", async () => {
      const agent = await makeAgentAndLogin(userA);
      const response = await agent.post("/api/articles").send(articleInput);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "작성 완료");
      expect(response.body).toHaveProperty("result");
    });

    it("PUT /api/articles/:id - 작성자 본인 수정 200", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createArticle(agentA);

      const response = await agentA
        .put(`/api/articles/${created.id}`)
        .send({ ...articleInput, title: "수정된 제목" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "수정 완료");
      expect(response.body.result.title).toBe("수정된 제목");
    });

    it("PUT /api/articles/:id - 비로그인 401", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createArticle(agentA);

      const response = await request(app)
        .put(`/api/articles/${created.id}`)
        .send({ ...articleInput, title: "비로그인 수정" });

      expect(response.statusCode).toBe(401);
    });

    it("PUT /api/articles/:id - 다른 사용자 수정 500", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createArticle(agentA);

      const agentB = await makeAgentAndLogin(userB);
      const response = await agentB
        .put(`/api/articles/${created.id}`)
        .send({ ...articleInput, title: "타인 수정" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message");
    });

    it("PUT /api/articles/:id - 존재하지 않는 게시글 500", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const response = await agentA
        .put(`/api/articles/9999999`)
        .send({ ...articleInput, title: "없음" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message");
    });

    it("DELETE /api/articles/:id - 작성자 본인 삭제 200", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createArticle(agentA);

      const response = await agentA.delete(`/api/articles/${created.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "삭제 완료");
    });

    it("DELETE /api/articles/:id - 비로그인 401", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createArticle(agentA);

      const response = await request(app).delete(`/api/articles/${created.id}`);

      expect(response.statusCode).toBe(401);
    });

    it("DELETE /api/articles/:id - 다른 사용자 삭제 403", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createArticle(agentA);

      const agentB = await makeAgentAndLogin(userB);
      const response = await agentB.delete(`/api/articles/${created.id}`);

      expect(response.statusCode).toBe(500);
    });

    it("DELETE /api/articles/:id - 존재하지 않는 게시글 500", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const response = await agentA.delete(`/api/articles/9999999`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message");
    });
  });

  // 유효성 검증 (필수 필드)
  describe("유효성 검증", () => {
    it("제목 누락 → 400", async () => {
      const agent = await makeAgentAndLogin(userA);
      const response = await agent.post("/api/articles").send({
        content: articleInput.content,
        tags: articleInput.tags,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "유효하지 않은 요청입니다.");
    });

    it("본문 누락 → 400", async () => {
      const agent = await makeAgentAndLogin(userA);
      const response = await agent.post("/api/articles").send({
        title: articleInput.title,
        tags: articleInput.tags,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "유효하지 않은 요청입니다.");
    });
  });
});
