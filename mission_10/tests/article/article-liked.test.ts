import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utills/prisma";

// 유저 에이전트 생성
const agent = request.agent(app);
const agent2 = request.agent(app);
describe("게시글 좋아요 테스트", () => {
let articleId1: number;
let articleId2: number;
jest.mock("../../src/utills/loginLimiter", () => ({
	loginLimiter: (req: any, res: any, next: any) => next(),
}));
jest.spyOn(console, "log").mockImplementation(() => {
	return;
});
	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.article.deleteMany();
		await prisma.articleLiked.deleteMany();
		await agent.post("/user/register").send({
			email: "test@example.com",
			nickname: "test",
			password: "test",
		});
		await agent.post("/user/login").send({
			email: "test@example.com",
			password: "test",
		});
		await agent2.post("/user/register").send({
			email: "test2@example.com",
			nickname: "test2",
			password: "test2",
		});
		await agent2.post("/user/login").send({
			email: "test2@example.com",
			password: "test2",
		});
		const createArticleResponse = await agent.post("/article").send({
			title: "test",
			content: "test",
		});
		articleId1 = createArticleResponse.body.id;
		const createArticleResponse2 = await agent2.post("/article").send({
			title: "test2",
			content: "test2",
		});
		articleId2 = createArticleResponse2.body.id;
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.article.deleteMany();
		await prisma.articleLiked.deleteMany();
		jest.restoreAllMocks();
	});

	test("게시글 좋아요 성공", async () => {
		const createArticleLikedResponse = await agent.post(`/article/${articleId1}/liked`);
		console.log(createArticleLikedResponse.text);
		expect(createArticleLikedResponse.statusCode).toBe(200);
	});

	test("게시글 좋아요 실패(게시글 없음)", async () => {
		const createArticleLikedResponse = await agent.post(`/article/999/liked`);
		expect(createArticleLikedResponse.statusCode).toBe(500);
	});

	test("게시글 좋아요 실패(이미 좋아요)", async () => {
		const createArticleLikedResponse = await agent.post(`/article/${articleId1}/liked`);
		expect(createArticleLikedResponse.statusCode).toBe(500);
	});

	test("게시글 좋아요 가져오기", async () => {
		const getArticleLikedResponse = await agent.get(`/article/${articleId1}/liked`);
		expect(getArticleLikedResponse.statusCode).toBe(200);
	});

	test("게시글 좋아요 취소", async () => {
		const deleteArticleLikedResponse = await agent.delete(`/article/${articleId1}/liked`);
		expect(deleteArticleLikedResponse.statusCode).toBe(200);
	});

	test("게시글 좋아요 취소 실패(게시글 없음)", async () => {
		const deleteArticleLikedResponse = await agent.delete(`/article/999/liked`);
		expect(deleteArticleLikedResponse.statusCode).toBe(500);
	});
});