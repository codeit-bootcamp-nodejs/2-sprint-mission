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

const ACCESS_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || "accessToken";
const REFRESH_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

// 쿠키 유틸
const hasCookie = (req: request.Response, name: string) => {
  const raw = req.headers["set-cookie"];
  if (!raw) return false;
  const list = Array.isArray(raw) ? raw : [raw];
  return list.some((cookie) => cookie.startsWith(`${name}=`));
};

describe("인증(auth)", () => {
  const testUser = {
    email: "auth-test@example.com",
    nickname: "testuser",
    password: "testpassword",
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

  describe("회원가입", () => {
    it("POST /api/auth/register - 성공 시 201, user 반환(비밀번호 제외)", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "회원가입 성공");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.nickname).toBe(testUser.nickname);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("POST /api/auth/register - 이메일 중복 시 500", async () => {
      await request(app).post("/api/auth/register").send(testUser).expect(201);
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.statusCode).toBe(500);
    });
  });

  describe("로그인", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser).expect(201);
    });

    it("POST /api/auth/login - 성공 시 200, 쿠키 세팅", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(testUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "로그인 성공");
      expect(response.body).toHaveProperty("user");
      expect(hasCookie(response, ACCESS_COOKIE)).toBe(true);
      expect(hasCookie(response, REFRESH_COOKIE)).toBe(true);
    });

    it("POST /api/auth/login - 잘못된 이메일 입력 시 400", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "wrong-email",
        password: testUser.password,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "유효하지 않은 요청입니다."
      );
    });

    it("POST /api/auth/login - 잘못된 비밀번호 입력 시 500", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrong-password",
      });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message", "비밀번호 불일치");
    });
  });

  describe("로그아웃", () => {
    it("POST /api/auth/logout - 성공 시 200, 쿠키 삭제", async () => {
      const agent = request.agent(app);

      await agent.post("/api/auth/register").send(testUser);
      const loginResponse = await agent.post("/api/auth/login").send(testUser);

      expect(loginResponse.statusCode).toBe(200);
      expect(hasCookie(loginResponse, ACCESS_COOKIE)).toBe(true);
      expect(hasCookie(loginResponse, REFRESH_COOKIE)).toBe(true);

      const logoutResponse = await agent.post("/api/auth/logout");

      expect(logoutResponse.statusCode).toBe(200);
      expect(logoutResponse.body).toHaveProperty("message", "로그아웃 완료");

      const cookies = logoutResponse.headers["set-cookie"] || [];
      const str = Array.isArray(cookies) ? cookies.join(";") : cookies;
      expect(str).toMatch(
        new RegExp(`${ACCESS_COOKIE}=.*(Max-Age=0|Expires=)`)
      );
      expect(str).toMatch(
        new RegExp(`${REFRESH_COOKIE}=.*(Max-Age=0|Expires=)`)
      );
    });
  });

  describe("토큰 재발급", () => {
    it("POST /api/auth/refresh - refreshToken 없음 → 401", async () => {
      const response = await request(app).post("/api/auth/refresh");

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "RefreshToken 없음");
    });

    it("POST /api/auth/refresh - refreshToken 있으면 AccessToken 재발급", async () => {
      const agent = request.agent(app);

      await agent.post("/api/auth/register").send(testUser);
      const loginResponse = await agent.post("/api/auth/login").send(testUser);

      expect(hasCookie(loginResponse, REFRESH_COOKIE)).toBe(true);

      const refreshResponse = await agent.post("/api/auth/refresh");

      expect(refreshResponse.body).toHaveProperty(
        "message",
        "Access Token 재발급 완료"
      );
      expect(hasCookie(refreshResponse, ACCESS_COOKIE)).toBe(true);
      expect(hasCookie(refreshResponse, REFRESH_COOKIE)).toBe(true);
    });
  });
});
