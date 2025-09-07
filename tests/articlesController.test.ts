import request from 'supertest';
import app from "../src/main";
import * as userRepository from '../src/repositories/usersRepository';
import { prismaClient } from '../src/lib/prismaClient';


//게시글 목록 조회 테스트 
const agent = request.agent(app)
const testUserInfo = {
    email: 'article_test@naver.com',
    password: '12345'
}
let id = 1;

beforeAll(async () => {
    const testuser = await userRepository.getUserByEmail(testUserInfo.email);
    if (testuser) {
        await prismaClient.product.deleteMany({
            where: { user: testuser }
        });
        await prismaClient.favorite.deleteMany({
            where: { user: testuser }
        });
        await prismaClient.comment.deleteMany({
            where: { user: testuser }
        });
        await prismaClient.like.deleteMany({
            where: { user: testuser }
        });
        await prismaClient.article.deleteMany({
            where: { user: testuser }
        });
        await userRepository.deleteUser(testuser.id);
    }
    const response = await agent.post('/auth/register').send({
        ...testUserInfo,
        nickname: '사과 나무',
        image: null
    });
    expect(response.status).toBe(201);

    const response_2 = await agent.post('/auth/login').send(testUserInfo);
    expect(response_2.status).toBe(200);
});

afterAll(async () => {
    await prismaClient.$disconnect();
});

describe('POST /articles', () => {
    test('게시글 생성 테스트', async () => {
        const body = {
            title: '내가 쓴 글',
            content: '내가 쓴 글 테스트 입니다.',
            image: null
        }

        const response = await agent.post('/articles').send(body);
        expect(response.status).toBe(201)
        expect(response.body.id).toBeDefined();
        id = response.body.id;
        console.log(response.body);
    });

    test("게시글 생성시 입력 오류인 경우", async () => {
        const body = {
            content: '내가 쓴 글 테스트 입니다.',
            image: null
        }
        const response = await agent.post('/articles').send(body);
        console.log(response.body);
        expect(response.status).toBe(400);
    });
})

describe('GET/articles', () => {
    test('게시글 목록 조회 테스트', async () => {
        const response = await request(app).get('/articles')
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
});

describe('GET /articles/:id', () => {
    test('게시글 상세 조회 테스트', async () => {
        const response = await request(app).get(`/articles/${id}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    test('없는 게시글을 상세 조회 할 경우 테스트', async () => {
        const response = await agent.delete('/posts/999')
        console.log(response.body);
        expect(response.statusCode).toBe(404);
    })

});

describe('PATCH /articles/:id', () => {
    test('게시글 정보 수정 테스트', async () => {
        const updateData = {
            "content": "이것은 업데이트된 테스트 Comment입니다."
        }

        const response = await agent.patch(`/articles/${id}`).send(updateData);
        console.log(response.body);
        expect(response.status).toBe(200);
    });
});

describe('GET /articles/:id/comments', () => {
    test('특정 게시글의 댓글 목록 조회 테스트', async () => {
        const ListData = {
            id: id
        }

        const response = await agent.get(`/articles/${id}/comments`).send(ListData);
        console.log(response.body);
        expect(response.status).toBe(200)
    });
});

describe('POST /articles/:id/likes', () => {
    test('특정 게시글의 좋아요 추가 테스트', async () => {
        const likesData = {
            id: id
        }

        const response = await agent.post(`/articles/${id}/likes`).send(likesData);
        console.log(response.body);
        expect(response.status).toBe(201)
    });
});

describe('DELETE /articles/:id/likes', () => {
    test('특정 게시글의 좋아요 삭제 테스트', async () => {
        const likesDeleteData = {
            id: id
        }
        const response = await agent.delete(`/articles/${id}/likes`).send(likesDeleteData);
        console.log(response.body);
        expect(response.status).toBe(204)
    });

    test('없는 좋아요를 삭제 할 경우 테스트', async () => {
        const response = await agent.delete(`/articles/${id}/likes`)
        console.log(response.body);
        expect(response.statusCode).toBe(400);
    })
});

describe('DELETE /articles/:id', () => {
    test('게시글 정보 삭제 테스트', async () => {
        const response = await agent.delete(`/articles/${id}`);
        console.log(response.body);
        expect(response.status).toBe(204);
    });

    test('없는 게시글을 삭제 할 경우 테스트', async () => {
        const response = await agent.delete(`/articles/${id}`)
        console.log(response.body);
        expect(response.statusCode).toBe(404);
    });
});
