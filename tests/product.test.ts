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

describe("상품(products)", () => {
  const userA = {
    email: "product-a@example.com",
    nickname: "productA",
    password: "pw1234",
  };
  const userB = {
    email: "product-b@example.com",
    nickname: "productB",
    password: "pw1234",
  };

  const productInput = {
    name: "test product",
    description: "test description",
    price: 1000,
    tags: ["test tag"],
  };

  const NOT_FOUND_OR_SERVER = 500;

  beforeAll(async () => {
    await testDb.$connect();
  });

  beforeEach(async () => {
    await testDb.notify.deleteMany();
    await testDb.productComment.deleteMany();
    await testDb.articleComment.deleteMany();
    await testDb.productLike.deleteMany();
    await testDb.articleLike.deleteMany();
    await testDb.article.deleteMany();
    await testDb.product.deleteMany();
    await testDb.user.deleteMany();
  });

  afterAll(async () => {
    await testDb.user.deleteMany().catch(() => {});
    await testDb.$disconnect();
  });

  // helpers
  const makeAgentAndLogin = async (user: typeof userA): Promise<Agent> => {
    const agent = request.agent(app);
    await request(app).post("/api/auth/register").send(user);
    const res = await agent.post("/api/auth/login").send(user);
    expect(res.status).toBe(200);
    return agent;
  };

  const createProduct = async (agent: Agent, body = productInput) => {
    const res = await agent.post("/api/products").send(body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "등록 완료");
    expect(res.body).toHaveProperty("result");
    return res.body.result as { id: number };
  };

  describe("상품 조회", () => {
    it("GET /api/products - 목록 조회", async () => {
      const agent = await makeAgentAndLogin(userA);
      await createProduct(agent);

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "상품 목록");
      expect(res.body).toHaveProperty("result");
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result.length).toBeGreaterThanOrEqual(1);
    });

    it("GET /api/products/:id - 개별 조회", async () => {
      const agent = await makeAgentAndLogin(userA);
      const created = await createProduct(agent);

      const res = await request(app).get(`/api/products/${created.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "개별 상품");
      expect(res.body).toHaveProperty("result");
      expect(res.body.result.id).toBe(created.id);
    });

    it("존재하지 않는 상품", async () => {
      const res = await request(app).get(`/api/products/9999999`);

      expect(res.statusCode).toBe(NOT_FOUND_OR_SERVER);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("success");
    });
  });

  describe("상품 등록,수정,삭제", () => {
    it("POST /api/products - 비로그인 401", async () => {
      const res = await request(app).post("/api/products").send(productInput);
      expect(res.statusCode).toBe(401);
    });

    it("POST /api/products - 로그인 후 생성 201", async () => {
      const agent = await makeAgentAndLogin(userA);
      const res = await agent.post("/api/products").send(productInput);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "등록 완료");
      expect(res.body).toHaveProperty("result");
    });

    it("PUT /api/products/:id - 작성자 본인 수정 200", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createProduct(agentA);

      const res = await agentA
        .put(`/api/products/${created.id}`)
        .send({ ...productInput, name: "updated name" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "수정 완료");
      expect(res.body.result.name).toBe("updated name");
    });

    it("PUT /api/products/:id - 비로그인 401", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createProduct(agentA);

      const res = await request(app)
        .put(`/api/products/${created.id}`)
        .send({ ...productInput, name: "try without login" });

      expect(res.statusCode).toBe(401);
    });

    it("PUT /api/products/:id - 다른 사용자 수정 403", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createProduct(agentA);

      const agentB = await makeAgentAndLogin(userB);
      const res = await agentB
        .put(`/api/products/${created.id}`)
        .send({ ...productInput, name: "modified by other" });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("PUT /api/products/:id - 존재하지 않는 상품 500", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const res = await agentA
        .put(`/api/products/9999999`)
        .send({ ...productInput, name: "not found" });

      expect(res.statusCode).toBe(NOT_FOUND_OR_SERVER);
      expect(res.body).toHaveProperty("message");
    });

    it("DELETE /api/products/:id - 작성자 본인 삭제 200", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createProduct(agentA);

      const res = await agentA.delete(`/api/products/${created.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "삭제 완료");
    });

    it("DELETE /api/products/:id - 비로그인 401", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createProduct(agentA);

      const res = await request(app).delete(`/api/products/${created.id}`);

      expect(res.statusCode).toBe(401);
    });

    it("DELETE /api/products/:id - 다른 사용자 삭제 403", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const created = await createProduct(agentA);

      const agentB = await makeAgentAndLogin(userB);
      const res = await agentB.delete(`/api/products/${created.id}`);

      expect(res.statusCode).toBe(403);
    });

    it("DELETE /api/products/:id - 존재하지 않는 상품 500", async () => {
      const agentA = await makeAgentAndLogin(userA);
      const res = await agentA.delete(`/api/products/9999999`);

      expect(res.statusCode).toBe(NOT_FOUND_OR_SERVER);
      expect(res.body).toHaveProperty("message");
    });
  });

  // 유효성 검증 (필수 필드)
  describe("유효성 검증", () => {
    it("이름 누락 → 400", async () => {
      const agent = await makeAgentAndLogin(userA);
      const res = await agent.post("/api/products").send({
        description: productInput.description,
        price: productInput.price,
        tags: productInput.tags,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "유효하지 않은 요청입니다.");
    });

    it("설명 누락 → 400", async () => {
      const agent = await makeAgentAndLogin(userA);
      const res = await agent.post("/api/products").send({
        name: productInput.name,
        price: productInput.price,
        tags: productInput.tags,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "유효하지 않은 요청입니다.");
    });

    it("가격 누락 → 400", async () => {
      const agent = await makeAgentAndLogin(userA);
      const res = await agent.post("/api/products").send({
        name: productInput.name,
        description: productInput.description,
        tags: productInput.tags,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "유효하지 않은 요청입니다.");
    });

    it("태그 누락 → 400", async () => {
      const agent = await makeAgentAndLogin(userA);
      const res = await agent.post("/api/products").send({
        name: productInput.name,
        description: productInput.description,
        price: productInput.price,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "유효하지 않은 요청입니다.");
    });
  });
});
