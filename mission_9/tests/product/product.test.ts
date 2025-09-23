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
describe("상품 생성 테스트", () => {
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
	});

	afterAll(async () => {
		await prisma.product.deleteMany();
		await prisma.user.deleteMany();
		jest.restoreAllMocks();
	});

	test("상품 상세 조회 mock 함수", async () => {
		const mockGetProductById = jest.fn();
		mockGetProductById.mockImplementation((id: number) => {
			return {
				id,
				name: "test",
				description: "test",
				price: 1000,
				tags: ["test"],
			};
		});
		const response = mockGetProductById(1);
		console.log(response);
		expect(response).toEqual({
			id: 1,
			name: "test",
			description: "test",
			price: 1000,
			tags: ["test"],
		});
	});

	test("상품 생성 성공", async () => {
		const response = await agent.post("/product").send({
			name: "test",
			description: "test",
			price: 1000,
			tags: ["test"],
		});
		expect(response.statusCode).toBe(200);
		productId1 = response.body.id;
	});

	test("상품 생성 실패(이름 없음)", async () => {
		const response = await agent.post("/product").send({
			description: "test",
			price: 1000,
			tags: ["test"],
		});
		expect(response.statusCode).toBe(500);
	});

	test("상품 조회 성공", async () => {
		const response = await agent.get(`/product/`);
		expect(response.statusCode).toBe(200);
	});

	test("상품 조회(검색)", async () => {
		const response = await agent.get(`/product/?search=test`);
		expect(response.statusCode).toBe(200);
	});
	test("상품 조회(fomer정렬)", async () => {
		const response = await agent.get(`/product/?sort=fomer`);
		expect(response.statusCode).toBe(200);
	});
	test("상품 조회(검색 상품 없음)", async () => {
		const response = await agent.get(`/product/?search=unexist`);
		expect(response.body.message).toBe(`unexist로 검색된 게시글이 없습니다. (offset: 0)`);
		expect(response.statusCode).toBe(200);
	});

	test("상품 상세 조회 성공", async () => {
		const response = await agent.get(`/product/${productId1}`);
		expect(response.statusCode).toBe(200);
	});

	test("상품 상세 조회 실패(상품 없음)", async () => {
		const response = await agent.get(`/product/999`);
		expect(response.statusCode).toBe(500);
	});

	test("상품 수정 성공", async () => {
		const response = await agent.patch(`/product/${productId1}`).send({
			name: "updated",
			description: "updated",
			price: 2000,
			tags: ["updated"],
		});
		expect(response.statusCode).toBe(200);
	});

	test("상품 수정 실패(상품 없음)", async () => {
		const response = await agent.patch(`/product/999`).send({
			name: "updated",
			description: "updated",
			price: 2000,
			tags: ["updated"],
		});
		expect(response.statusCode).toBe(500);
	});
		
	test("상품 수정 실패(인증되지 않은 사용자)", async () => {
		const response = await anotherAgent.patch(`/product/${productId1}`).send({
			name: "updated",
			description: "updated",
			price: 2000,
			tags: ["updated"],
		});
		expect(response.statusCode).toBe(403);
	});

	test("상품 삭제 실패(인증되지 않은 사용자)", async () => {
		const response = await anotherAgent.delete(`/product/${productId1}`);
		expect(response.statusCode).toBe(403);
	});

	test("상품 삭제 성공", async () => {
		const response = await agent.delete(`/product/${productId1}`);
		expect(response.statusCode).toBe(204);
	});

	test("상품 삭제 실패(상품 없음)", async () => {
		const response = await agent.delete(`/product/999`);
		expect(response.statusCode).toBe(404);
	});
});