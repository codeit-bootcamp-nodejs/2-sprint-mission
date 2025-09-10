import request from "supertest";
import { app } from "../src/app";
import prisma from "../src/lib/prisma";
import TestAgent from "supertest/lib/agent";

let agent: TestAgent;
let anotherAgent: TestAgent;
let testUserId: number;
let productId: number;
let userAProductId: number;
let userBProductId: number;

const email = "test1@sample.com";
const nickname = "test1";
const password = "password";
const email2 = "test2@sample.com"
const nickname2 = "test2";
const password2 = "password";
const name = 'test 상품';
const description = 'test 설명';
const price = 10000;
const tags = ['test태그1', 'test태그2'];
const testProductId = 999999;

beforeAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.product.deleteMany();
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
* POST/product API 
* 새로운 상품 생성(인증 필요)
*/
describe('POST/products/create', () => {

    beforeEach(async () => { 
        await prisma.product.deleteMany();
    })
    
    test('req.body 모두 충족', async () => {
        const response = await agent.post('/products/create').send({
            name,
            price,
            description,
            tags,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.product.name).toEqual(name);
        expect(response.body.userId).toEqual(testUserId);

        const count = await prisma.product.count();
        expect(count).toEqual(1);
    });
    
    test('description 불충족', async () => {
        const response = await agent.post('/products/create').send({
            name,
            price,
            tags,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("description should not be empty");
    });

    test('name 불충족', async () => {
        const response = await agent.post('/products/create').send({
            price,
            tags,
            description,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("name should not be empty");
    });

    test('price 불충족', async () => {
        const response = await agent.post('/products/create').send({
            name,
            description,
            tags,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("price should not be empty");
    });

    test('tags 불충족', async () => {
        const response = await agent.post('/products/create').send({
            name,
            description,
            price,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.errors).toContain("tags should not be empty");
    });

    test('로그인하지 않으면 생성할 수 없어야 함', async () => {
        const response = await request(app).post('/products/create').send({
            name,
            description,
            price,
            tags,
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.');
    });
});

/*
* PATCH/product API 
* 상품 일부 수정(인증 필요)
*/
describe('PATCH/products/update/:id', () => {

    beforeEach(async () => {
        await prisma.product.deleteMany();
        const product = await agent.post('/products/create').send({
            name,
            price,
            description,
            tags,
        });
        productId = product.body.product.id;
    });

    test('존재하지 않는 상품 수정', async () => {
        const response = await agent.patch(`/products/update/${testProductId}`).send({
            name: 'test상품'
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Product not found');
    });

    test('권한 없는 사용자의 수정', async () => {
        const response = await anotherAgent.patch(`/products/update/${productId}`).send({
            name: 'test상품',
        });
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual('Unauthorized to update this product');
    });
    
    test('모두 충족 ', async () => {
        const response = await agent.patch(`/products/update/${productId}`).send({
            name: 'test상품입니다',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Product updated successfully')
        expect(response.body.product.name).toEqual('test상품입니다');
    });

    test('찜한 상품의 가격 변동 시 알람메세지 발생되어야 함', async () => {
        await anotherAgent.post(`/likes/products/${productId}`);

        const response = await agent.patch(`/products/update/${productId}`).send({
            price: 8000,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Product updated successfully')
        expect(response.body.product.price).toBe(8000);
        
        const notification = await anotherAgent.get('/notifications');
        expect(notification.body.length).toBe(1);
        expect(notification.statusCode).toBe(200);
        expect(notification.body[0].message).toContain('상품의 가격이');
        expect(notification.body[0].message).toContain('변경되었습니다.');
    })

    test('로그인하지 않으면 수정할 수 없어야 함', async () => { 
        const response = await request(app).patch(`/products/update/${productId}`).send({
            name: 'test상품입니다',
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.');
    })
});

/*
* Delete/product API 
* 상품 삭제(인증 필요)
*/
describe('DELETE/products/:id', () => {
    beforeEach(async () => {
        await prisma.product.deleteMany();
        const product = await agent.post('/products/create').send({
            name,
            price,
            description,
            tags,
        });
        productId = product.body.product.id;
    });

    test('존재하지 않는 상품 삭제', async () => {
        const response = await agent.delete(`/products/${testProductId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Product not found');
    });

    test('권한 없는 사용자의 삭제', async () => {
        const response = await anotherAgent.delete(`/products/${productId}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual('Unauthorized to delete this product');
        
    });

    test('모두 충족', async () => {
        const response = await agent.delete(`/products/${productId}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    });

    test('로그인하지 않으면 삭제할 수 없어야 함', async() => {
        const response = await request(app).delete(`/products/${productId}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.')
    });
});

/*
* GET/product API 
* 사용자가 등록한 상품 목록(인증 필요)
*/
describe('GET/products/my-product', () => {
    beforeEach(async () => {
        await prisma.product.deleteMany();
        const product1 = await agent.post('/products/create').send({
            name: 'A유저의 물품',
            price,
            description,
            tags,
        });
        userAProductId = product1.body.product.id

        const product2 = await anotherAgent.post('/products/create').send({
            name: 'B유저의 물품',
            price,
            description,
            tags,
        });
        userBProductId = product2.body.product.id;
    });

    test('로그인한 사용자의 상품 목록 조회', async () => {
        const response = await agent.get('/products/my-product');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body).toBeInstanceOf(Array);
        
        const product = response.body[0];
        expect(product.name).toEqual('A유저의 물품');
        expect(product.id).toEqual(userAProductId)
    });

    test('로그인하지 않은 사용자의 접근', async () => {
        const response = await request(app).get('/products/my-product');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.'); 
    });

    test('등록한 상품이 없을 때 빈 배열을 반환해야 함', async () => { 
        await prisma.product.deleteMany();
        const response = await agent.get('/products/my-product');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })
});

/*
* GET/product API 
* 사용자가 좋아요한 상품 목록(인증 필요)
*/
describe('GET/products/me/liked-products', () => {
    beforeEach(async () => {
        await prisma.product.deleteMany();
        const product1 = await agent.post('/products/create').send({
            name: 'A유저의 물품',
            price,
            description,
            tags,
        });
        userAProductId = product1.body.product.id

        const product2 = await anotherAgent.post('/products/create').send({
            name: 'B유저의 물품',
            price,
            description,
            tags,
        });
        userBProductId = product2.body.product.id;
    });

    test('로그인한 사용자의 좋아요 한 상품 목록 조회', async () => {
        await agent.post(`/likes/products/${userBProductId}`);

        const response = await agent.get('/products/me/liked-products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);

        const likedProducts = response.body[0];
        expect(likedProducts.name).toEqual('B유저의 물품');
        expect(likedProducts.id).toEqual(userBProductId);
    });

    test('로그인하지 않은 사용자의 접근', async () => {
        const response = await request(app).get('/products/me/liked-products');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('로그인이 필요합니다.');
    });

    test('좋아요한 상품이 없을 때 빈 배열을 반환해야 함', async () => {
        const response = await agent.get('/products/me/liked-products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});

/*
* GET/product API 
* 전체 상품 목록(인증 필요)
*/
describe('GET/products, 인증 필요', () => {
    beforeEach(async () => {
        await prisma.product.deleteMany();

        const productA = await agent.post('/products/create').send({
            name: 'A유저의 물품',
            price,
            description,
            tags,
        });
        userAProductId = productA.body.product.id;

        const productB = await anotherAgent.post('/products/create').send({
            name: 'B유저의 물품',
            price,
            description,
            tags,
        });
        userBProductId = productB.body.product.id;
    });
    test('좋아요 한 상품은 isliked가 true로 반환 됨', async () => {
        await agent.post(`/likes/products/${userBProductId}`);

        const response = await agent.get('/products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);

        const productA = response.body.find((p: any) => p.id === userAProductId);
        const productB = response.body.find((p: any) => p.id === userBProductId);

        expect(productA.name).toEqual('A유저의 물품');
        expect(productA.isLiked).toBe(false);
        
        expect(productB.name).toEqual('B유저의 물품');
        expect(productB.isLiked).toBe(true);
    });

    test('상품이 없을 때는 빈 배열을 반환해야 함', async () => {
        await prisma.product.deleteMany();

        const response = await agent.get("/products");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })

});

/*
* GET/product API 
* 전체 상품 목록(인증 불필요)
*/
describe('GET/products, 인증 불필요', () => {
    beforeEach(async () => {
        await prisma.product.deleteMany();

        const product1 = await agent.post('/products/create').send({
            name: 'A유저의 물품',
            price,
            description,
            tags,
        });
        userAProductId = product1.body.product.id;

        const product2 = await anotherAgent.post('/products/create').send({
            name: 'B유저의 물품',
            price,
            description,
            tags,
        });
        userBProductId = product2.body.product.id;
    });

    test('로그인하지 않은 사용자도 상품 목록 확인 가능해야함.', async () => {
        const response = await request(app).get("/products");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);

        const response2 = await request(app).post(`/likes/products/${userBProductId}`);
        expect(response2.statusCode).toBe(401);

        const product1 = response.body[0];
        expect(product1.isLiked).toBe(false);
        const product2 = response.body[1];
        expect(product2.isLiked).toBe(false);
    });
});
