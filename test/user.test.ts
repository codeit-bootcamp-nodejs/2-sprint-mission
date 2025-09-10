import request from "supertest";
import { app } from "../src/app";
import prisma from "../src/lib/prisma";
import TestAgent from "supertest/lib/agent";

let agent: TestAgent;
let anotherAgent: TestAgent;

const email = "test1@sample.com";
const nickname = "test1";
const password = "password";
const email2 = "test2@sample.com"
const nickname2 = "test2";
const password2 = "password";

let userId: number;

beforeAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
});
    
afterAll(async () => {
    await prisma.$disconnect();
});
    
/*
* POST/user API 
* 회원가입(인증 불필요)
*/
describe('POST/users/register', () => {

    beforeEach(async () => { 
        await prisma.user.deleteMany();
    })
    test('email 미입력시 400 에러 반환', async () => {
        const response = await request(app).post('/users/register')
            .field('nickname', nickname)
            .field('password', password);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("email should not be empty");
    });

    test('nickname 미입력시 400 에러 반환', async () => {
        const response = await request(app).post('/users/register')
            .field('email', email)
            .field('password', password);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("nickname should not be empty");
    });

    test('password 미입력시 400 에러 반환', async () => {
        const response = await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("password should not be empty");
    });

    test('req.body 모두 충족 시 회원가입 완료', async () => {
        const response = await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.user.email).toEqual('test1@sample.com')

        const count = await prisma.user.count();
        expect(count).toEqual(1);
    });

    test('email 중복 시 409 에러 반환', async () => {
        const response = await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
        
        expect(response.statusCode).toBe(201);

        const response2 = await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname2)
            .field('password', password);
        
        expect(response2.statusCode).toBe(409);
        expect(response2.body.message).toEqual('Email already exist! Please Change to something else')
    });

    test('nickname 중복 시 에러 반환', async () => {
        const response = await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
        
        expect(response.statusCode).toBe(201);

        const response2 = await request(app).post('/users/register')
            .field('email', email2)
            .field('nickname', nickname)
            .field('password', password);
        
        expect(response2.statusCode).toBe(409);
        expect(response2.body.message).toEqual('Nickname already exist! Please Change to something else')
    });
});

/*
* POST/user API 
* 로그인(인증 필요)
*/
describe('POST/users/login', () => {
    beforeEach(async () => {
        await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
    });

    test('email, password 모두 전송, 로그인 성공', async () => {
        const response = await request(app).post('/users/login').send({
            email,
            password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.user.nickname).toEqual(nickname);
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeTruthy();
    });

    test('email, password 모두 전송했으나 비밀번호 틀림', async () => {
        const response = await request(app).post('/users/login').send({
            email,
            password2
        });
        expect(response.statusCode).toBe(400);
    });

    test('email만 전송', async () => {
        const response = await request(app).post('/users/login').send({
            email,
        });
        expect(response.statusCode).toBe(400);
    });

    test('password만 전송', async () => {
        const response = await request(app).post('/users/login').send({
            password,
        });
        expect(response.statusCode).toBe(400);
    });
});

/*
* GET/user API 
* 내 정보 불러오기 
*/
describe('GET/users/me', () => {
    beforeEach(async () => {
        await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
    });

    test('로그인 후 정보 불러오기', async () => {
        agent = request.agent(app);
        await agent.post('/users/login').send({
            email,
            password
        });

        const response = await agent.get('/users/me');
        expect(response.statusCode).toBe(200);
        expect(response.body.nickname).toEqual(nickname);
        expect(response.body.email).toEqual(email);
    });

    test('로그인하지 않고 요청', async () => {
        const response = await request(app).get('/users/me');
        expect(response.statusCode).toBe(401);
    });
});

/*
* PATCH/user API 
* 사용자 정보 수정(인증 필요)
*/
describe('PATCH/users/me', () => {
    beforeEach(async () => {
        await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
    });
    test('사용자가 본인의 정보 수정', async () => {
        await agent.post('/users/login').send({
            email,
            password,
        });

        const response = await agent.patch('/users/me').send({
            nickname: '정보 변경 테스터'
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('User updated successfully!');
        expect(response.body.user.nickname).toEqual('정보 변경 테스터');
    });

    test('로그인하지 않은 사용자의 정보 수정', async () => {
        const response = await request(app).patch('/users/me').send({
            nickname: '정보 변경 테스터'
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.'); 
    });
});

/*
* DELETE/user API 
* 회원탈퇴(인증 필요)
*/

describe('DELETE/users/:id', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
        await request(app).post('/users/register')
            .field('email', email)
            .field('nickname', nickname)
            .field('password', password);
        
        await request(app).post('/users/register')
            .field('email', email2)
            .field('nickname', nickname2)
            .field('password', password2);
        
        const userA = await agent.post('/users/login').send({
            email,
            password,
        });
        userId = userA.body.user.id;
    });

    test('다른 유저의 회원 탈퇴 시도시 403에러 반환', async () => {
        const anotherAgent = request.agent(app);
        await anotherAgent.post('/users/login').send({
            email: email2,
            password: password2,
        });
        const response = await anotherAgent.delete(`/users/${userId}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual('You are not authorized to delete this account.');
    });
    
    test('로그인한 사용자의 회원 탈퇴', async () => {
        const agent = request.agent(app);
        await agent.post('/users/login').send({
            email,
            password,
        });
        const response = await agent.delete(`/users/${userId}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    })
});
