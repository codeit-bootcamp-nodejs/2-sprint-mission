import request from 'supertest';
import app from '../src/main';
import * as userRepository from '../src/repositories/usersRepository';
import { prismaClient } from '../src/lib/prismaClient';

const agent = request.agent(app)
const testUserInfo = {
    email: 'product_test@naver.com',
    password: '12345'
};
let id = 0;

beforeAll(async () => {
    const testuser = await userRepository.getUserByEmail(testUserInfo.email);
    if (testuser) {
        console.log("Test User Exists, Remove...");
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

describe('POST /products, 상품 생성 테스트', () => {
    test('상품 생성 테스트', async () => {
        const body = {
            name: '복숭아',
            description: '달달한 복숭아',
            price: 130,
            tags: ['과일'],
            images: ['복숭아 사진']
        };

        const response = await agent.post('/products').send(body);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        id = response.body.id;
        console.log(response.body);
        /*
        {
            id: 10
            ...            
        }
            console.log(response.body.id)
            ->
            10
        */
    })
    test("상품 생성시 입력 오류인 경우", async () => {
        const body = {
            description: '달달한 복숭아',
            price: 130,
            tags: ['과일'],
            images: ['복숭아 사진']
        }
        const response = await agent.post("/products").send(body);
        console.log(response.body);
        expect(response.status).toBe(400);
    });
});

describe('GET /products,', () => {
    test('상품 목록 조회 테스트', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
});

describe('GET /products/:id', () => {
    test('상품 상세 조회 테스트', async () => {
        //테스트 요청하기 
        const response = await request(app).get(`/products/${id}`);
        //테스트 할 항목 가져오기 
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        //테스트 할 항목 안에 들어가야 할 데이터가 없을 때 결과 정의 하기 
    });

    test('없는 상품을 상세 조회 할 경우 테스트', async () => {
        const response = await agent.delete('/posts/999')
        console.log(response.body);
        expect(response.statusCode).toBe(404);
    })
});

describe('PATCH /products/:id', () => {
    test('상품 가격 업데이트 시 테스트', async () => {
        //TODO: 가능한 모든 항목 업데이트 테스트
        const updateData = {
            name: '복숭아',
            description: '달달한 복숭아',
            price: 130,
            tags: ['과일'],
            images: ['복숭아 사진']
        };
        const response = await agent.patch(`/products/${id}`).send(updateData);
        expect(response.status).toBe(200);
    });

    test('상품 업데이트 정보 오류 테스트', async () => {
        const updateData = {
            price: '130',
        };
        const response = await agent.patch(`/products/${id}`).send(updateData);
        console.log(response.body);
        expect(response.status).toBe(400);
    })
});

describe('POST /products/:id/comments', () => {
    test('특정 상품의 댓글 작성 테스트', async () => {
        const CreateData = {
            content: '새로운 댓글',
            productId: id
        }

        const response = await agent.post(`/products/${id}/comments`).send(CreateData);
        console.log(response.body);
        expect(response.status).toBe(201)
    });

    test('특정 상품의 댓글 입력 오류 테스트', async () => {
        const CreateData = {
            productId: id
        }

        const response = await agent.post(`/products/${id}/comments`).send(CreateData);
        console.log(response.body);
        expect(response.status).toBe(400)
    });

});

describe('GET /products/:id/comments', () => {
    test('특정 상품의 댓글 목록 조회 테스트', async () => {
        const ListData = {
            id: id
        }

        const response = await agent.get(`/products/${id}/comments`).send(ListData);
        console.log(response.body);
        expect(response.status).toBe(200)
    });
});

describe('POST /products/:id/favorites', () => {
    test('특정 상품의 좋아요 추가 테스트', async () => {
        const FavoritesData = {
            id: id
        }

        const response = await agent.post(`/products/${id}/favorites`).send(FavoritesData);
        console.log(response.body);
        expect(response.status).toBe(201)
    });
});

describe('DELETE /products/:id/favorites', () => {
    test('특정 상품의 좋아요 삭제 테스트', async () => {
        const FavoritesDeleteData = {
            id: id
        }
        const response = await agent.delete(`/products/${id}/favorites`).send(FavoritesDeleteData);
        console.log(response.body);
        expect(response.status).toBe(204)
    });

    test('없는 좋아요를 삭제 할 경우 테스트', async () => {
        const response = await agent.delete(`/products/${id}/favorites`)
        console.log(response.body);
        expect(response.statusCode).toBe(400);
    })
});

describe('DELETE /products/:id', () => {
    test('상품 정보 삭제 테스트', async () => {
        const response = await agent.delete(`/products/${id}`);
        expect(response.status).toBe(204);
    })

    test('없는 상품 정보를 삭제 할 경우 테스트', async () => {
        const response = await agent.delete(`/products/${id}`)
        console.log(response.body);
        expect(response.statusCode).toBe(404);
    });
});