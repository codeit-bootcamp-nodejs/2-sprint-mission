// ‼️ TODO : 주석 정리
// Load test environment variables FIRST
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

// 쿠키 이름 (.env.test) -> 컨트롤러에서 refreshToken 하드코딩, 그대로 사용
const ACCESS_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || "accessToken";
const REFRESH_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

// 쿠키 유틸
const hasCookie = (req: request.Response, name: string) => {
  const raw = req.headers["set-cookie"];
  if (!raw) return false;
  const list = Array.isArray(raw) ? raw : [raw];
  return list.some((cookie) => cookie.startsWith(`${name}=`));
};

describe("상품", () => {
  const testUser = {
    email: "product-test@example.com", // Different email from auth tests
    nickname: "productuser",
    password: "testpassword",
  };

  const testProduct = {
    name: "test product",
    description: "test description",
    price: 1000,
    tags: ["test tag"],
  };

  beforeAll(async () => {
    await testDb.$connect();
  });

  beforeEach(async () => {
    await testDb.user.deleteMany();
    await testDb.product.deleteMany();
    await testDb.article.deleteMany();
    await testDb.notify.deleteMany();
    await testDb.productComment.deleteMany();
    await testDb.articleComment.deleteMany();
    await testDb.productLike.deleteMany();
    await testDb.articleLike.deleteMany();
  });

  afterAll(async () => {
    await testDb.user.deleteMany().catch(() => {});
    await testDb.$disconnect();
  });

  describe("POST /api/products", () => {
    it("상품 등록 성공하면 result 전달", async () => {
      const agent = request.agent(app);

      // 회원가입
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(registerResponse.status).toBe(201);

      // 로그인 (agent가 쿠키를 기억해서 .set('Cookie')로 넣을 필요없음)
      const loginResponse = await agent.post("/api/auth/login").send(testUser);
      expect(loginResponse.statusCode).toBe(200);

      // agent가 쿠키 저장하지만, 혹시 몰라서 쿠키 확인
      const cookies = loginResponse.headers["set-cookie"];
      expect(Array.isArray(cookies)).toBe(true);

      // 상품 등록
      const productResponse = await agent
        .post("/api/products")
        .send(testProduct);

      expect(productResponse.statusCode).toBe(201);
      expect(productResponse.body).toHaveProperty("message", "등록 완료");
      expect(productResponse.body).toHaveProperty("result");
    });

    it("상품 이름 등록하지 않음", async () => {
      const agent = request.agent(app);

      // 회원가입
      await request(app).post("/api/auth/register").send(testUser);

      // 로그인 (agent가 쿠키를 기억해서 .set('Cookie')로 넣을 필요없음)
      await agent.post("/api/auth/login").send(testUser);

      // 상품 이름 등록 x
      const productResponse = await agent.post("/api/products").send({
        description: testProduct.description,
        price: testProduct.price,
        tags: testProduct.tags,
      });

      expect(productResponse.statusCode).toBe(400);
      expect(productResponse.body).toHaveProperty(
        "message",
        "유효하지 않은 요청입니다."
      );
    });

    it("상품 설명 등록하지 않음", async () => {
      const agent = request.agent(app);

      // 회원가입
      await request(app).post("/api/auth/register").send(testUser);

      // 로그인 (agent가 쿠키를 기억해서 .set('Cookie')로 넣을 필요없음)
      await agent.post("/api/auth/login").send(testUser);

      // 상품 설명 등록 x
      const productResponse = await agent.post("/api/products").send({
        name: testProduct.name,
        price: testProduct.price,
        tags: testProduct.tags,
      });

      expect(productResponse.statusCode).toBe(400);
      expect(productResponse.body).toHaveProperty(
        "message",
        "유효하지 않은 요청입니다."
      );
    });

    it("상품 가격 등록하지 않음", async () => {
      const agent = request.agent(app);

      // 회원가입
      await request(app).post("/api/auth/register").send(testUser);

      // 로그인 (agent가 쿠키를 기억해서 .set('Cookie')로 넣을 필요없음)
      await agent.post("/api/auth/login").send(testUser);

      // 상품 가격 등록 x
      const productResponse = await agent.post("/api/products").send({
        name: testProduct.name,
        description: testProduct.description,
        tags: testProduct.tags,
      });

      expect(productResponse.statusCode).toBe(400);
      expect(productResponse.body).toHaveProperty(
        "message",
        "유효하지 않은 요청입니다."
      );
    });
  });

  describe("GET /api/products, GET /api/products/:id", () => {
    it("전체 상품 목록 조회", async () => {
      // 회원가입, 로그인
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);

      // 상품 등록
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      // 등록한 상품들 목록 조회
      const productResponse = await request(app).get("/api/products");

      expect(productResponse.statusCode).toBe(200);
      expect(productResponse.body).toHaveProperty("message", "상품 목록");
      expect(productResponse.body).toHaveProperty("result");
    });

    it("상품 개별 조회", async () => {
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      const id = createdProduct.body.result.id;

      const productResponse = await request(app).get(`/api/products/${id}`);

      expect(productResponse.statusCode).toBe(200);
      expect(productResponse.body).toHaveProperty("message", "개별 상품");
      expect(productResponse.body).toHaveProperty("result");
    });

    it("존재하지 않는 상품", async () => {
      // 회원가입, 로그인
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);

      // 상품 등록
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      // const id = createdProduct.body.result.id;

      // 존재하지 않는 상품 조회
      const productResponse = await request(app).get(`/api/products/9999999`);

      expect(productResponse.statusCode).toBe(500);
      expect(productResponse.body).toHaveProperty("message");
      expect(productResponse.body).toHaveProperty("success");
    });
  });

  describe("PUT /api/products/:id", () => {
    it("상품 수정 성공", async () => {
      // 회원가입, 로그인
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);

      // 상품 등록
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      const id = createdProduct.body.result.id;

      // 상품 수정
      const updatedProduct = await agent
        .put(`/api/products/${id}`)
        .send(testProduct);

      expect(updatedProduct.statusCode).toBe(200);
      expect(updatedProduct.body).toHaveProperty("message", "수정 완료");
      expect(updatedProduct.body).toHaveProperty("result");
    });

    it("존재하지 않는 상품", async () => {
      // 회원가입, 로그인
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);

      // 상품 등록
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      const id = createdProduct.body.result.id;

      // 존재하지 않는 상품 수정
      const updatedProduct = await agent
        .put(`/api/products/9999999`)
        .send(testProduct);

      expect(updatedProduct.statusCode).toBe(500);
      expect(updatedProduct.body).toHaveProperty("message");
      expect(updatedProduct.body).toHaveProperty("success");
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("상품 삭제 성공", async () => {
      // 회원가입, 로그인
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);

      // 상품 등록
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      const id = createdProduct.body.result.id;

      // 상품 삭제
      const deletedProduct = await agent.delete(`/api/products/${id}`);

      expect(deletedProduct.statusCode).toBe(200);
      expect(deletedProduct.body).toHaveProperty("message", "삭제 완료");
    });

    it("존재하지 않는 상품", async () => {
      // 회원가입, 로그인
      const agent = request.agent(app);
      await request(app).post("/api/auth/register").send(testUser);
      await agent.post("/api/auth/login").send(testUser);

      // 상품 등록
      const createdProduct = await agent
        .post("/api/products")
        .send(testProduct);
      expect(createdProduct.statusCode).toBe(201);

      const id = createdProduct.body.result.id;

      // 존재하지 않는 상품 삭제
      const deletedProduct = await agent.delete(`/api/products/9999999`);

      expect(deletedProduct.statusCode).toBe(500);
      expect(deletedProduct.body).toHaveProperty("message");
      expect(deletedProduct.body).toHaveProperty("success");
    });
  });
});
