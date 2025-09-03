import request from "supertest";
import app from "../../src/app";
import { db } from "../../src/lib/db";
import TestAgent from "supertest/lib/agent";

let agent: TestAgent;
let productId: number;
let accessToken: string;

beforeAll(async () => {
  await db.productLike.deleteMany();
  await db.productComment.deleteMany();
  await db.product.deleteMany();
  await db.articleLike.deleteMany();
  await db.articleComment.deleteMany();
  await db.article.deleteMany();
  await db.user.deleteMany();

  agent = request.agent(app);

  await agent.post("/auth/register").send({
    email: "product@test.com",
    password: "test123",
    nickname: "produser",
  });

  const loginRes = await agent.post("/auth/login").send({
    email: "product@test.com",
    password: "test123",
  });

  expect(loginRes.status).toBe(200);
  accessToken = loginRes.body.accesstoken;
});

afterAll(async () => {
  await db.$disconnect();
});

describe("Product API", () => {
  test("상품 등록 성공", async () => {
    const res = await agent
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "테스트 상품",
        description: "테스트 설명",
        price: 1000,
        tags: ["tag1", "tag2"],
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toEqual("상품이 등록되었습니다.");
    expect(res.body.productId).toBeTruthy();

    productId = res.body.productId;
  });

  test("인증 없이 상품 등록시 401 반환", async () => {
    const res = await request(app)
      .post("/products")
      .send({
        name: "인증 실패 상품",
        description: "토큰 없음",
        price: 1000,
        tags: ["tag1", "tag2"],
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toEqual("인증이 필요합니다.");
  });

  test("상품 목록 조회", async () => {
    const res = await agent.get("/products");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("상품 목록 조회 성공");
    expect(res.body.products).toBeTruthy();
  });

  test("상품 단일 조회", async () => {
    const res = await agent
      .get(`/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.product).toBeTruthy();
  });

  test("상품 수정", async () => {
    const res = await agent
      .patch(`/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "수정된 상품",
        description: "수정된 설명",
        price: 2000,
        tags: ["tag3"],
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("상품 정보가 수정되었습니다.");
  });

  test("상품 좋아요 토글", async () => {
    const res = await agent
      .post(`/products/${productId}/like`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status === 200 || res.status === 201).toBeTruthy();
    expect(res.body.liked === true || res.body.liked === false).toBeTruthy();
  });

  test("상품 삭제", async () => {
    const res = await agent
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("상품이 삭제되었습니다.");
  });
});
