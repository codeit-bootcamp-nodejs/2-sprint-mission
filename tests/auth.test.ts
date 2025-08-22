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

describe("인증", () => {
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

  describe("POST /api/auth/register", () => {
    it("회원가입성공하면 user 정보 반환(비밀번호 제외)", async () => {
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

    it("이메일 중복이면 회원가입 실패", async () => {
      await request(app).post("/api/auth/register").send(testUser).expect(201);
      const response = await request(app).post("/api/auth/register").send({
        email: testUser.email,
        nickname: testUser.nickname,
        password: testUser.password,
      });

      expect(response.statusCode).toBe(500);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser).expect(201);
    });

    it("로그인 성공하면 쿠키 세팅", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(testUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "로그인 성공");
      expect(response.body).toHaveProperty("user");
      // 쿠키 세팅
      expect(hasCookie(response, ACCESS_COOKIE)).toBe(true);
      expect(hasCookie(response, REFRESH_COOKIE)).toBe(true);
    });

    it("잘못된 이메일 입력", async () => {
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

    it("잘못된 비밀번호 입력", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrong-password",
      });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message", "비밀번호 불일치");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("로그아웃 성공하면 쿠키 삭제", async () => {
      const agent = request.agent(app);

      // 회원가입 + 로그인
      await agent.post("/api/auth/register").send(testUser);
      const loginResponse = await agent.post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body).toHaveProperty("message", "로그인 성공");
      expect(loginResponse.body).toHaveProperty("user");

      expect(hasCookie(loginResponse, ACCESS_COOKIE)).toBe(true);
      expect(hasCookie(loginResponse, REFRESH_COOKIE)).toBe(true);

      // 로그아웃
      const logoutResponse = await agent.post("/api/auth/logout");

      expect(logoutResponse.statusCode).toBe(200);
      expect(logoutResponse.body).toHaveProperty("message", "로그아웃 완료");

      // 일반적으로 clearTokens는 만료 시각 과거로 설정된 쿠키를 내려줌
      // 명확한 검증을 하려면 set-cookie에 Max-Age=0 또는 Expires 과거값 포함 여부를 체크
      const cookies = logoutResponse.headers["set-cookie"] || [];
      const str = Array.isArray(cookies) ? cookies.join(";") : cookies;
      expect(str).toMatch(
        new RegExp(`${ACCESS_COOKIE}=.*(Max-Age=0|Expires=)`)
      );
      expect(str).toMatch(
        new RegExp(`${REFRESH_COOKIE}=.*(Max-Age=0|Expires=)`)
      );
    })
  })

  describe("POST /api/auth/refresh", () => {
    it("refreshToken 없음", async () => {
      const response = await request(app).post("/api/auth/refresh")

      expect(response.statusCode).toBe(401)
      expect(response.body).toHaveProperty("message", "RefreshToken 없음");
    });

    it("refreshToken 쿠키 있으면 Access Token 재발급, 쿠키 세팅 가능", async () => {
      const agent = request.agent(app);

      // 회원가입 + 로그인(쿠키 확보)
      await agent.post("/api/auth/register").send(testUser)
      const loginResponse = await agent
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password })

      expect(hasCookie(loginResponse, REFRESH_COOKIE)).toBe(true);

      // 재발급
      const refreshResponse = await agent.post("/api/auth/refresh");
      expect(refreshResponse.body).toHaveProperty(
        "message",
        "Access Token 재발급 완료"
      );
      // 새 accessToken 쿠키 내려오는지 확인(이름 동일)
      expect(hasCookie(refreshResponse, ACCESS_COOKIE)).toBe(true);
      // 정책상 refreshToken은 그대로 유지(setTokensAsCookies에서 재세팅할 수 있음)
      expect(hasCookie(refreshResponse, REFRESH_COOKIE)).toBe(true);
    });
  });
});
