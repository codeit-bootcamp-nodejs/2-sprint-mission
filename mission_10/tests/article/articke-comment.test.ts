import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utills/prisma";

// 유저 에이전트 생성
const agent = request.agent(app);
const agent2 = request.agent(app);
describe("게시글 댓글 테스트", () => {
	let articleId1: number;
	let commentId1: number;
	jest.spyOn(console, "log").mockImplementation(() => {
		return;
	});
	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.article.deleteMany();
		await prisma.articleComment.deleteMany();
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
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.article.deleteMany();
		await prisma.articleComment.deleteMany();
		jest.restoreAllMocks();
	});

	test("게시글 댓글 생성", async () => {
		const createArticleCommentResponse = await agent.post(`/article/${articleId1}/comment`).send({
			content: "test",
		});
		commentId1 = createArticleCommentResponse.body.id;
		expect(createArticleCommentResponse.statusCode).toBe(200);
	});

	test("게시글 댓글 생성 실패(게시글 없음)", async () => {
		const createArticleCommentResponse = await agent.post(`/article/999/comment`).send({
			content: "test",
		});
		expect(createArticleCommentResponse.statusCode).toBe(500);
	});


	test("자신의 게시글 댓글 가져오기", async () => {
		await agent.post(`/article/${articleId1}/comment`).send({
			content: "test",
		});
		const createArticleCommentResponse2 = await agent.post(`/article/${articleId1}/comment`).send({
			content: "test2",
		});
		const cursorId2 = createArticleCommentResponse2.body.id;
		const getArticleCommentResponse = await agent.get(`/article/comment`);
		expect(getArticleCommentResponse.statusCode).toBe(200);
		expect(getArticleCommentResponse.body.comments.length).toBe(3);
		expect(getArticleCommentResponse.body.message).toBe(`다음 커서는 ${cursorId2}입니다.`);
		const getArticleCommentResponse2 = await agent.get(`/article/comment?cursor=${cursorId2+ 1}`);
		console.log(JSON.stringify(getArticleCommentResponse2.body));
		expect(getArticleCommentResponse2.body).toEqual({"message":"다음 커서가 없습니다.","comments":[]});
		
	});


	test("게시글 댓글 수정", async () => {
		const updateArticleCommentResponse = await agent.patch(`/article/comment/${commentId1}`).send({
			content: "updated",
		});
		expect(updateArticleCommentResponse.statusCode).toBe(200);
	});
		
	test("게시글 댓글 수정 실패(작성자가 아님)", async () => {
		const updateArticleCommentResponse = await agent2.patch(`/article/comment/${commentId1}`).send({
			content: "updated",
		});
		expect(updateArticleCommentResponse.statusCode).toBe(403);
	});

	test("게시글 댓글 수정 실패(댓글 없음)", async () => {
		const updateArticleCommentResponse = await agent.patch(`/article/comment/999`).send({
			content: "updated",
		});
		expect(updateArticleCommentResponse.statusCode).toBe(404);
	});

	test("게시글 댓글 삭제 실패(작성자가 아님)", async () => {
		const deleteArticleCommentResponse = await agent2.delete(`/article/comment/${commentId1}`);
		expect(deleteArticleCommentResponse.statusCode).toBe(403);
	});
	test("게시글 댓글 삭제", async () => {
		const deleteArticleCommentResponse = await agent.delete(`/article/comment/${commentId1}`);
		expect(deleteArticleCommentResponse.statusCode).toBe(204);
	});

	test("게시글 댓글 삭제 실패(게시글 없음)", async () => {
		const deleteArticleCommentResponse = await agent.delete(`/article/comment/999`);
		expect(deleteArticleCommentResponse.statusCode).toBe(404);
	});
});
