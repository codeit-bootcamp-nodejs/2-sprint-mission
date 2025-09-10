import app from '../app';
import request from 'supertest';
import { db } from '../utils/db';
import TestAgent from "supertest/lib/agent";


let agent: TestAgent;
let articleId = 0;

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

  const article = await agent
    .post("/article/create")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title: 'test',
      content: 'test'
    });
  articleId = article.body.id
});



afterAll(async () => {
  await db.$disconnect();

});

afterEach(async () => {
  await db.articleLike.deleteMany({});
})


// 게시글 생성
// post('/create',

describe("POST /article/create", () => {
  test("필수 정보 모두 있음 (정상)", async () => {
    const response = await agent
      .post("/article/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: 'test',
        content: 'test'
      });
    expect(response.statusCode).toEqual(201);
  });

  test("필수 정보가 일부 없음", async () => {
    let response = await agent
      .post('/article/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: 'test'
      });
    expect(response.statusCode).toEqual(400);

    response = await agent
      .post('/article/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: 'test'
      });
    expect(response.statusCode).toEqual(400);

    response = await agent
      .post('/article/create')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});
    expect(response.statusCode).toEqual(400);
  })
});


// 게시글 수정
// patch('/change/:id', 

describe("PATCH /article/change/:id", () => {

  test("로그인 된 사용자가 아닌 경우", async () => {

    const response = await request(app)
      .patch(`/article/change/${articleId}`)
      .send({
        title: 'test',
        content: 'test'
      });
    expect(response.statusCode).toBe(401);

  })

  test("자신이 올린 게시글이 아닌 경우", async () => {
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

    const articleResponse = await agent
      .post("/article/create")
      .set("Authorization", `Bearer ${testToken2}`)
      .send({
        title: 'test2',
        content: 'test2'
      });



    await agent.post("/users/login").send({
      nickname,
      password,
    });

    const response = await agent
      .patch(`/article/change/${articleResponse.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: 'test',
        content: 'test'
      });
    expect(response.statusCode).toBe(403);
  });

  test("수정데이터를 아예 입력 안 한 경우", async () => {
    const response = await agent
      .patch(`/article/change/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
    expect(response.statusCode).toEqual(400);
  })

  test("수정 모두 정상", async () => {
    const response = await agent
      .patch(`/article/change/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: 'test수정',
        content: 'test수정'

      })
    expect(response.statusCode).toEqual(200);

  })

});



// 게시글 삭제
// delete('/remove/:id', 

describe('DELETE /article/remove/:id', () => {
  test('로그인된 사용자가 아닌 경우', async () => {
    const response = await request(app)
      .delete(`/article/remove/${articleId}`)
    expect(response.statusCode).toBe(401);
  });

  test('존재하지 않는 상품일 경우', async () => {
    const reponse = await agent
      .delete(`/article/remove/${articleId + 999}`)
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

    const articleResponse = await agent
      .post("/article/create")
      .set("Authorization", `Bearer ${testToken2}`)
      .send({
        title: 'test',
        content: 'test'
      });

    await agent.post("/users/login").send({
      nickname,
      password,
    });

    const response = await agent
      .delete(`/article/remove/${articleResponse.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(403);
  });


});


// 게시글 좋아요
// post('/likes/:articleId',

describe('POST /article/likes/:articleId', () => {
  test("로그인 안 된 유저의 좋아요 누르기", async () => {
    const response = await request(app)
      .post(`/article/likes/${articleId}`)
    expect(response.statusCode).toBe(401);
  });


  test("없는 게시글에 좋아요 누르기", async () => {
    const response = await agent
      .post(`/article/likes/${articleId + 999}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  });


  test("한 유저가 중복으로 좋아요 누름", async () => {
    let response = await agent
      .post(`/article/likes/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    response = await agent
      .post(`/article/likes/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(409);
  });


  test("좋아요 성공", async () => {
    const response = await agent
      .post(`/article/likes/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(200);
  });

});


// 좋아요 취소
// delete('/likesCancel/:articleId'

describe('DELETE /article/likesCancel/:articleId', () => {
  test("로그인 안 된 사용자의 좋아요 취소", async () => {
    const response = await request(app)
      .delete(`/article/likesCancel/${articleId}`)
    expect(response.statusCode).toBe(401);

  });
  test("없는 제품 좋아요 취소", async () => {
    const response = await request(app)
      .delete(`/article/likesCancel/${articleId + 999}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  });


  test("좋아요 안 누른 제품 취소할 경우", async () => {
    const response = await agent
      .delete(`/article/likesCancel/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);

  });

  test("좋아요 취소 성공", async () => {
    let response = await agent
      .post(`/article/likes/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    response = await agent
      .delete(`/article/likesCancel/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200);
  });
});


// get('/isLiked'

describe("GET /isLiked", () => {
  test("로그인 안한 사람의 조회", async () => {
    const response = await request(app).get('/article/isLiked')
    expect(response.statusCode).toBe(401);
  })

  test("좋아요한 상품이 없을 경우", async () => {
    const response = await agent
      .get('/article/isLiked')
      .set("Authorization", `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(404);
  })

  test("좋아요한 상품 정상 출력", async () => {

    const article = await agent
      .post("/article/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: 'test',
        content: 'test'
      });
    articleId = article.body.id

    await agent
      .post(`/article/likes/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);


    const response = await agent
      .get('/article/isLiked')
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('isLiked', true);
  })

});

