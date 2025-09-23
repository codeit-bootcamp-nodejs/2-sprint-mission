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
describe("상품 댓글 생성 테스트", () => {
	let productId: number;
	let commentId: number;
	const agent = request.agent(app);
	const anotherAgent = request.agent(app);
	beforeAll(async () => {
		await prisma.productComment.deleteMany();
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
		const response = await agent.post("/product").send({
			name: "test",
			description: "test",
			price: 1000,
			tags: ["test"],
		});
		productId = response.body.id;
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
		await prisma.productComment.deleteMany();
		await prisma.product.deleteMany();
		await prisma.user.deleteMany();
		jest.restoreAllMocks();
		await prisma.$disconnect();
	});
	test("상품 댓글 생성", async () => {
		const response = await agent.post(`/product/${productId}/comment`).send({
			content: "test",
		});
		commentId = response.body.id;
		expect(response.statusCode).toBe(200);
		expect(response.body.content).toBe("test");
	});
	test("상품 댓글 생성 실패(상품 없음)", async () => {
		const response = await agent.post(`/product/999/comment`).send({
			content: "test",
		});
		expect(response.statusCode).toBe(500);
	});

	test("상품 댓글 생성 실패(콘텐츠 없음)", async () => {
		const response = await agent.post(`/product/${productId}/comment`).send({
		});
		expect(response.statusCode).toBe(500);
	});

	test("상품 댓글 수정", async () => {
		const response = await agent.patch(`/product/comment/${commentId}`).send({
			content: "updated",
		});
		expect(response.statusCode).toBe(200);
		expect(response.body.content).toBe("updated");
	});

	test("상품 댓글 수정 실패(댓글 없음)", async () => {
		const response = await agent.patch(`/product/comment/999`).send({
			content: "updated",
		});
		expect(response.statusCode).toBe(404);
	});

	test("상품 댓글 수정 실패(인증되지 않은 사용자)", async () => {
		const response = await anotherAgent.patch(`/product/comment/${commentId}`).send({
			content: "updated",
		});
		expect(response.statusCode).toBe(401);
	});

	test("상품 댓글 조회", async () => {
		const response = await agent.get(`/product/comment`);
		expect(response.statusCode).toBe(200);
	});

	test("상품 댓글 삭제 실패(인증되지 않은 사용자)", async () => {
		const response = await anotherAgent.delete(`/product/comment/${commentId}`);
		expect(response.statusCode).toBe(401);
	});

	test("상품 댓글 삭제", async () => {
		const response = await agent.delete(`/product/comment/${commentId}`);
		expect(response.statusCode).toBe(204);
	});

	test("상품 댓글 삭제 실패(댓글 없음)", async () => {
		const response = await agent.delete(`/product/comment/999`);
		expect(response.statusCode).toBe(404);
	});


});
