import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utills/prisma";

// 로그인 리미터 해제
jest.mock("../../src/utills/loginLimiter", () => ({
	loginLimiter: (req: any, res: any, next: any) => next(),
}));
jest.spyOn(console, "log").mockImplementation(() => {
	return;
});
describe("상품 좋아요 테스트", () => {
	const agent = request.agent(app);
	const anotherAgent = request.agent(app);
	let productId1: number;
	beforeAll(async () => {
		await prisma.product.deleteMany();
		await prisma.user.deleteMany();
		await agent.post("/user/register").send({
			email: "test@example.com",
			nickname: "test",
			password: "test",
		});
		await agent.post("/user/login").send({
			email: "test@example.com",
			password: "test",
		});
		await anotherAgent.post("/user/register").send({
			email: "test2@example.com",
			nickname: "test2",
			password: "test2",
		});
		await anotherAgent.post("/user/login").send({
			email: "test2@example.com",
			password: "test2",
		});
		const response = await agent.post("/product").send({
			name: "test",
			description: "test",
			price: 1000,
			tags: ["test"],
		});
		productId1 = response.body.id;
	});
	afterAll(async () => {
		await prisma.product.deleteMany();
		await prisma.user.deleteMany();
		jest.restoreAllMocks();
	});
	test("상품 좋아요 추가", async () => {
		const response = await agent.post(`/product/${productId1}/liked`);
		expect(response.statusCode).toBe(200);
	});
	test("상품 좋아요 추가 실패(상품 없음)", async () => {
		const response = await agent.post(`/product/999/liked`);
		expect(response.statusCode).toBe(500);
	});
	test("상품 좋아요 조회", async () => {
		const response = await agent.get(`/product/${productId1}/liked`);
		expect(response.statusCode).toBe(200);
	});
	test("상품 좋아요 삭제", async () => {
		const response = await agent.delete(`/product/${productId1}/liked`);
		expect(response.statusCode).toBe(204);
	});
	test("상품 좋아요 삭제 실패(좋아요 없음)", async () => {
		const response = await agent.delete(`/product/999/liked`);
		expect(response.text).toBe("ERROR: 좋아요를 찾을 수 없습니다.");
		expect(response.statusCode).toBe(500);
	});
});