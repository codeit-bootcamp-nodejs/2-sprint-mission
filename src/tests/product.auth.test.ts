import app from '../app';
import request from 'supertest';
import { db } from '../utils/db';
import TestAgent from "supertest/lib/agent";


jest.mock("../service/notification-service", () => ({
  notificationService: {
    sendNotification: jest.fn().mockResolvedValue(true),
  },
}));

let agent: TestAgent;
let productId = 0;

const email = 'test';
const nickname = 'test';
const password = 'test';
let accessToken: string;

beforeAll(async () => {
  await db.productLike.deleteMany();
  await db.article.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();

  agent = request.agent(app);

  await agent.post('/users/create').send({
    email,
    nickname,
    password,
  });

  const login = await agent.post('/users/login').send({
    nickname,
    password,
  });
  accessToken = login.body.accessToken;

  const product = await agent
    .post("/product/create")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: 'test',
      description: 'test',
      price: 10000,
      tags: ['test']
    });
  productId = product.body.id
});



afterAll(async () => {
  await db.$disconnect();

});

afterEach(async () => {
  await db.productLike.deleteMany({});
})

// // 상품 등록 - 로그인한 유저만 상품 등록 가능 (유효성 검사 포함)
// router.post('/create', 

describe("POST /product/create", () => {
  test("필수 정보 모두 있음 (정상)", async () => {
    const response = await agent
      .post("/product/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      });
    expect(response.statusCode).toEqual(201);
  });

  test("필수 정보가 일부 없음", async () => {
    let response = await agent
      .post('/product/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: 'test',
        price: 10000,
        tags: ['test']
      });
    expect(response.statusCode).toEqual(400);

    response = await agent
      .post('/product/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        price: 10000,
        tags: ['test']
      });
    expect(response.statusCode).toEqual(400);

    response = await agent
      .post('/product/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        description: 'test',
        tags: ['test']
      });
    expect(response.statusCode).toEqual(400);

    response = await agent
      .post('/product/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
      });
    expect(response.statusCode).toEqual(400);
    response = await agent
      .post('/product/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});
    expect(response.statusCode).toEqual(400);
  })
});




// // 상품 수정 - 로그인한 유저, 본인 상품만 수정 가능
// router.patch('/change/:id', 
describe("PATCH /product/change/:id", () => {

  test("로그인 된 사용자가 아닌 경우", async () => {

    const response = await request(app)
      .patch(`/product/change/${productId}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      });
    expect(response.statusCode).toBe(401);

  })

  test("자신이 올린 상품이 아닌 경우", async () => {
    await agent.post("/users/create").send({
      email: "test2",
      nickname: "test2",
      password,
    });

    const user2 = await agent.post("/users/login").send({
      nickname: "test2",
      password,
    });

    const testToken2 = user2.body.accessToken;

    const productResponse = await agent
      .post("/product/create")
      .set("Authorization", `Bearer ${testToken2}`)
      .send({
        name: 'test2',
        description: 'test2',
        price: 10000,
        tags: ['test']
      });



    await agent.post("/users/login").send({
      nickname,
      password,
    });

    const response = await agent
      .patch(`/product/change/${productResponse.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      });
    expect(response.statusCode).toBe(403);
  });

  test("수정데이터를 아예 입력 안 한 경우", async () => {
    const response = await agent
      .patch(`/product/change/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
    expect(response.statusCode).toEqual(400);
  })

  test("수정 모두 정상", async () => {
    const response = await agent
      .patch(`/product/change/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test수정',
        description: 'test수정',
        price: 100001,
        tags: ['test']

      })
    expect(response.statusCode).toEqual(200);

  })

});




// // 상품 삭제 - 로그인한 유저, 본인 상품만 삭제 가능


describe('DELETE /product/remove/:id', () => {
  test('로그인된 사용자가 아닌 경우', async () => {
    const response = await request(app)
      .delete(`/product/remove/${productId}`)
    expect(response.statusCode).toBe(401);
  });

  test('존재하지 않는 상품일 경우', async () => {
    const reponse = await agent
      .delete(`/product/remove/${productId + 999}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(reponse.statusCode).toBe(404);
  });

  test('자신의 상품이 아닌 경우', async () => {
    await agent.post("/users/create").send({
      email: "test2",
      nickname: "test2",
      password,
    });

    const user2 = await agent.post("/users/login").send({
      nickname: "test2",
      password,
    });

    const testToken2 = user2.body.accessToken;

    const productResponse = await agent
      .post("/product/create")
      .set("Authorization", `Bearer ${testToken2}`)
      .send({
        name: 'test2',
        description: 'test2',
        price: 10000,
        tags: ['test']
      });

    await agent.post("/users/login").send({
      nickname,
      password,
    });

    const response = await agent
      .delete(`/product/remove/${productResponse.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(403);
  });


});

//  상품 좋아요 추가 - 로그인한 유저가 특정 상품에 좋아요 누르기
// router.post('/likes/:productId', 

describe('POST /product/likes/:productId', () => {
  test("로그인 안 된 유저의 좋아요 누르기", async () => {
    const response = await request(app)
      .post(`/product/likes/${productId}`)
    expect(response.statusCode).toBe(401);
  });


  test("없는 제품에 좋아요 누르기", async () => {
    const response = await agent
      .post(`/product/likes/${productId + 999}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  });


  test("한 유저가 중복으로 좋아요 누름", async () => {
    let response = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    response = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(409);
  });


  test("좋아요 성공", async () => {
    const response = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(200);
  });

});


// // 상품 좋아요 취소 - 로그인한 유저가 특정 상품 좋아요 취소
// router.delete('/likesCancel/:productId', 

describe('DELETE /product/likesCancel/:productId', () => {
  test("로그인 안 된 사용자의 좋아요 취소", async () => {
    const response = await request(app)
      .delete(`/product/likesCancel/${productId}`)
    expect(response.statusCode).toBe(401);

  });
  test("없는 제품 좋아요 취소", async () => {
    const response = await request(app)
      .delete(`/product/likesCancel/${productId + 999}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  });


  test("좋아요 안 누른 제품 취소할 경우", async () => {
    const response = await agent
      .delete(`/product/likesCancel/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);

  });

  test("좋아요 취소 성공", async () => {
    let response = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    response = await agent
      .delete(`/product/likesCancel/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200);
  });
});

// // 로그인한 유저가 좋아요한 상품 목록 조회
// router.get('/likesList'

describe("GET /product/likesList", () => {
  test("로그인 하지 않은 유저가 좋아요한 상품 목록 조회", async () => {

    const like = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    const response = await request(app).get('/product/likesList');
    expect(response.statusCode).toBe(401);
  });

  test("정상출력", async () => {

    const like = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    const response = await agent.get('/product/likesList')
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(200);
  });

});


// // 상품 목록 조회 시, 로그인 유저가 좋아요 눌렀는지 여부(isLiked 필드 포함)
// router.get('/isLiked', 

describe("GET /isLiked", () => {
  test("로그인 안한 사람의 조회", async () => {
    const response = await request(app).get('/product/isLiked')
    expect(response.statusCode).toBe(401);
  })

  test("좋아요한 상품이 없을 경우", async () => {
    const response = await agent
      .get('/product/isLiked')
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  })

  test("좋아요한 상품 정상 출력", async () => {

    const product = await agent
      .post("/product/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      });
    productId = product.body.id

    await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);


    const response = await agent
      .get('/product/isLiked')
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('isLiked', true);
  })

});

// router.patch('/price/:productId',

describe("PATCH /product/price/:productId", () => {
  test("로그인 안한 사람이 수정", async () => {
    const response = await request(app)
      .patch(`/product/price/${productId}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      })

    expect(response.statusCode).toBe(401);
  });

  test("없는 제품 수정", async () => {
    const response = await agent
      .patch(`/product/price/${productId + 999}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  });

  test("가격 변동이 없을 경우", async () => {

    let response = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    response = await agent
      .patch(`/product/price/${productId}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      })
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(400)
  })

  test("정상 가격변동 알림", async () => {
    let response = await agent
      .post("/product/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: 'test',
        description: 'test',
        price: 10000,
        tags: ['test']
      });
    productId = response.body.id

    response = await agent
      .post(`/product/likes/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    response = await agent
      .patch(`/product/price/${productId}`)
      .send({
        name: 'test',
        description: 'test',
        price: 101220,
        tags: ['test']
      })
      .set("Authorization", `Bearer ${accessToken}`)
      expect(response.statusCode).toBe(200)
  });

})