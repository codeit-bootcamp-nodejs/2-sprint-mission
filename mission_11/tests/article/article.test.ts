import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utills/prisma";

// 유저 에이전트 생성
const agent = request.agent(app);
const agent2 = request.agent(app);
describe("게시글 테스트",  () => {
	let articleId: number;
	// 로그 출력 방지
	jest.spyOn(console, "log").mockImplementation(() => {
		return;
	});
	beforeAll(async () => {
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

		await agent2.post("/user/register").send({
			email: "test2@example.com",
			nickname: "test2",
			password: "test2",
		});
		await agent2.post("/user/login").send({
			email: "test2@example.com",
			password: "test2",
		});
	});

  afterAll(async () => {
    await prisma.article.deleteMany();
	});

	test("게시글 생성 테스트", async () => {
		const createArticleResponse = await agent.post("/article").send({
			title: "test",
			content: "test",
		});
		articleId = createArticleResponse.body.id;
		expect(createArticleResponse.body.title).toEqual("test");
		expect(createArticleResponse.body.content).toEqual("test");
		expect(createArticleResponse.statusCode).toBe(200);
	});
	
	test("게시글 상세 조회 테스트", async () => {
		const getArticleResponse = await agent.get(`/article/${articleId}`);
		expect(getArticleResponse.body.title).toEqual("test");
		expect(getArticleResponse.body.content).toEqual("test");
		expect(getArticleResponse.statusCode).toBe(200);
	});
		
	test("게시글 조회 테스트", async () => {
		const getArticleResponse = await agent.get("/article");
		expect(getArticleResponse.body[0].title).toEqual("test");
		expect(getArticleResponse.body[0].content).toEqual("test");
		expect(getArticleResponse.statusCode).toBe(200);
	});
		
	test("게시글 수정 테스트", async () => {
		const updateArticleResponse = await agent.patch(`/article/${articleId}`).send({
			title: "test2",
			content: "test2",
		});
		expect(updateArticleResponse.body.title).toEqual("test2");
		expect(updateArticleResponse.body.content).toEqual("test2");
		expect(updateArticleResponse.statusCode).toBe(200);
	});

	test("게시글 수정 실패(내가 생성한 게시글이 아닐 때)", async () => {
		const updateArticleResponse = await agent2.patch(`/article/${articleId}`).send({
			title: "test2",
			content: "test2",
		});
		expect(updateArticleResponse.statusCode).toBe(403);
	});

	test("게시글 수정 실패(게시글이 없을 때)", async () => {
		const updateArticleResponse = await agent.patch(`/article/${articleId + 1}`).send({
			title: "test2",
			content: "test2",
		});
		expect(updateArticleResponse.statusCode).toBe(500);
	});
		
	test("게시글 삭제 실패(내가 생성한 게시글이 아닐 때)", async () => {
		const deleteArticleResponse = await agent2.delete(`/article/${articleId}`);
		expect(deleteArticleResponse.statusCode).toBe(403);
	});

	test("게시글 삭제 테스트", async () => {
		const deleteArticleResponse = await agent.delete(`/article/${articleId}`);
		expect(deleteArticleResponse.statusCode).toBe(204);
	});

	test("게시글 삭제 실패(게시글이 없을 때)", async () => {
		const deleteArticleResponse = await agent.delete(`/article/${articleId + 1}`);
		expect(deleteArticleResponse.statusCode).toBe(500);
	});

	test("게시글 조회 테스트(게시글이 없을 때)", async () => {
		const getArticleResponse = await agent.get("/article");
		expect(getArticleResponse.statusCode).toBe(200);
		expect(getArticleResponse.body.message).toEqual("게시글이 없습니다.");
	});
});
