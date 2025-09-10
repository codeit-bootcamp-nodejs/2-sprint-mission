import request from "supertest";
import { app } from "../src/app";
import prisma from "../src/lib/prisma";
import TestAgent from "supertest/lib/agent";

let agent: TestAgent;
let anotherAgent: TestAgent;
let testUserId: number;
let articleId: number;
let AuserArticleId: number;
let BuserArticleId: number;

const email = "test1@sample.com";
const nickname = "test1";
const password = "password";
const email2 = "test2@sample.com"
const nickname2 = "test2";
const password2 = "password";
const title = 'test 게시글 제목';
const content = 'test 게시글 본문입니다.';
const testArticletId = 9999;

beforeAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();

    // agent 및 anotherAgent 초기화
    agent = request.agent(app);
    anotherAgent = request.agent(app);

    // 사용자 1 등록 및 로그인
    await agent.post('/users/register').send({
        email,
        nickname,
        password,
    });
    const user1Login = await agent.post('/users/login').send({
        email,
        password,
    });
    testUserId = user1Login.body.userId;

    // 사용자 2 등록 및 로그인 (권한 없음 테스트)
    await anotherAgent.post('/users/register').send({
        email: email2,
        nickname: nickname2,
        password: password2,
    });
    await anotherAgent.post('/users/login').send({
        email: email2,
        password: password2,
    });
});

afterAll(async () => { 
    await prisma.$disconnect();
})

/*
* POST/article API 
* 새로운 게시글 생성(인증 필요)
*/
describe('POST/articles/create', () => {

    test('req.body 모두 충족', async() => {
        const response = await agent.post('/articles/create').send({
            title,
            content,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.article.title).toEqual('test 게시글 제목');
        expect(response.body.userId).toEqual(testUserId);

        const count = await prisma.article.count();
        expect(count).toEqual(1);
    });

    test('title 불충족', async () => {
        const response = await agent.post('/articles/create').send({
            content,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("title should not be empty");
    });

    test('content 불충족', async () => {
        const response = await agent.post('/articles/create').send({
            title,
        })
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("content should not be empty");
    });

    test('로그인하지 않으면 생성할 수 없어야 함', async () => {
        const response = await request(app).post('/articles/create').send({
            title,
            content,
        });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.');
    })
});

/*
* PATCH/article API 
* 게시글 일부 수정(인증 필요)
*/
describe('PATCH/articles/update/:id', () => {
    beforeEach(async () => {
        await prisma.article.deleteMany();
        const article = await agent.post('/articles/create').send({
            title,
            content,
        });
        articleId = article.body.article.id;
    });

    test('존재하지 않는 게시글 수정', async () => {
        const response = await agent.patch(`/articles/update/${testArticletId}`).send({
            title: '존재하지 않는 게시글',
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Article not found');
    });

    test('권한 없는 사용자의 수정', async () => {
        const response = await anotherAgent.patch(`/articles/update/${articleId}`).send({
            title: '권한 없는 사용자',
        });
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual('Unauthorized to update this article')
    });

    test('모두 충족', async () => {
        const response = await agent.patch(`/articles/update/${articleId}`).send({
            title: '작성자의 게시글 수정',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Article updated successfully!');
        expect(response.body.article.title).toEqual('작성자의 게시글 수정');
    });

    test('로그인하지 않으면 수정할 수 없어야 함', async () => {
        const response = await request(app).patch(`/articles/update/${articleId}`).send({
            title: '비회원의 게시글 수정'
        });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.');
    })
});

/*
* Delete/article API 
* 게시글 삭제(인증 필요)
*/
describe('DELETE/articles/:id', () => {
    beforeEach(async () => {
        await prisma.article.deleteMany();
        const article = await agent.post('/articles/create').send({
            title,
            content,
        });
        articleId = article.body.article.id;
    });

    test('존재하지 않는 게시글 삭제', async() => {
        const response = await agent.delete(`/articles/${testArticletId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Article not found');
    });

    test('권한 없는 사용자의 게시글 삭제', async () => {
        const response = await anotherAgent.delete(`/articles/${articleId}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual('Unauthorized to delete this article')
    });

    test('로그인하지 않으면 삭제할 수 없어야 함', async() => {
        const response = await request(app).delete(`/articles/${articleId}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.')
    });

    test('모두 충족', async() => {
        const response = await agent.delete(`/articles/${articleId}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    });
});


/*
* GET/article API 
* 사용자가 등록한 게시글 목록(인증 필요)
*/
describe('GET/articles/my-article', () => {
    beforeEach(async () => {
        await prisma.article.deleteMany();
        const article1 = await agent.post('/articles/create').send({
            title: 'A유저의 게시물',
            content,
        });
        AuserArticleId = article1.body.article.id;

        const article2 = await anotherAgent.post('/articles/create').send({
            title: 'B유저의 게시물',
            content,
        });
        BuserArticleId = article2.body.article.id;
    });

    test('로그인한 사용자의 게시글 목록 조회', async () => {
        const response = await agent.get('/articles/my-article');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body).toBeInstanceOf(Array);

        const article = response.body[0];
        expect(article.title).toEqual('A유저의 게시물');
        expect(article.id).toBe(AuserArticleId);

        const response2 = await anotherAgent.get('/articles/my-article');
        const article2 = response2.body[0];
        expect(article2.title).toEqual('B유저의 게시물');
        expect(article2.id).toBe(BuserArticleId);
    });

    test('로그인하지 않은 사용자의 접근', async () => {
        const response = await request(app).get('/articles/my-article');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.'); 
    });

    test('작성한 게시물이 없을 때 빈 배열을 반환해야 함', async() => {
        await prisma.article.deleteMany();
        const response = await agent.get('/articles/my-article');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('여러 개 조회 확인', async () => { 
        await agent.post('/articles/create').send({
            title: 'A유저의 게시물 2',
            content,
        });
        const response = await agent.get('/articles/my-article');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
    });
});

/*
* GET/article API 
* 전체 게시글 목록(인증 필요)
*/
describe('GET/articles, 인증필요', () => {
    beforeEach(async () => {
        await prisma.article.deleteMany();
        const article1 = await agent.post('/articles/create').send({
            title: 'A유저의 게시물',
            content,
        });
        AuserArticleId = article1.body.article.id;

        const article2 = await anotherAgent.post('/articles/create').send({
            title: 'B유저의 게시물',
            content,
        });
        BuserArticleId = article2.body.article.id;
    });
    test('좋아요 한 게시글은 isliked가 true로 반환 됨', async() => {
        await agent.post(`/likes/articles/${BuserArticleId}`);

        const response = await agent.get('/articles');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        
        const article1 = response.body.find((p: any) => p.id === AuserArticleId);
        const article2 = response.body.find((p: any) => p.id === BuserArticleId);

        expect(article1.title).toEqual('A유저의 게시물');
        expect(article1.isLiked).toBe(false);

        expect(article2.title).toEqual('B유저의 게시물');
        expect(article2.isLiked).toEqual(true);
    });

    test('게시물이 없을 때는 빈 배열을 반환해야 함', async () => {
        await prisma.article.deleteMany();

        const response = await agent.get('/articles');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});

/*
* GET/article API 
* 전체 게시글 목록(인증 불팔요)
*/
describe('GET/articles, 인증 불필요', () => {
    beforeEach(async () => {
        await prisma.article.deleteMany();
        const article1 = await agent.post('/articles/create').send({
            title: 'A유저의 게시물',
            content,
        });
        AuserArticleId = article1.body.article.id;

        const article2 = await anotherAgent.post('/articles/create').send({
            title: 'B유저의 게시물',
            content,
        });
        BuserArticleId = article2.body.article.id;
    });

    test('로그인하지 않은 사용자도 게시글 목록 확인 가능해야함', async () => {
        const response = await request(app).get('/articles');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);

        const response2 = await request(app).post(`/likes/articles/${BuserArticleId}`);
        expect(response2.statusCode).toBe(401);

        const article1 = response.body[0];
        expect(article1.isLiked).toBe(false);
        const article2 = response.body[1];
        expect(article2.isLiked).toBe(false);
    });
});