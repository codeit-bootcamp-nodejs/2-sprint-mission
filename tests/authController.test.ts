import request from "supertest"
import app from "../src/main";
import { prismaClient } from '../src/lib/prismaClient';
import * as userRepository from '../src/repositories/usersRepository';

describe('authController 테스트', () => {
    const testUserInfo = {
        email: 'auth_test@naver.com',
        password: '12345'
    };
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
        };
    });

    afterAll(async () => {
        await prismaClient.$disconnect();
    });

    test('POST /register, 회원가입 테스트', async () => {
        const response = await request(app).post('/auth/register').send({
            ...testUserInfo,
            nickname: '사과나무',
            image: null
        });
        expect(response.body).toBeDefined();
        if (response.body.message != 'User already exists') {
            expect(response.status).toBe(201);
        } else {
            console.log("Test User Already Exists, TEST PASS");
        }
    })

    test('POST /로그인 테스트', async () => {
        const response = await request(app).post('/auth/login').send(testUserInfo);
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    })
})