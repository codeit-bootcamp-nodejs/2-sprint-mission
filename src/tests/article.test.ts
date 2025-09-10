import app from '../app';
import request from 'supertest';
import { db } from '../utils/db';


// 인증이 필요하지 않은 게시글 api 
// /detail/: id
//   / list

describe("GET /article/detail/:id", () => {
  let userId: number;
  let articleId: number;

  beforeAll(async () => {
    await db.product.deleteMany({});
    await db.article.deleteMany({});
    await db.user.deleteMany({});

    const user = await db.user.create({
      data: {
        email: 'test',
        nickname: 'test',
        password: 'test'
      }
    });
    userId = user.id;
    const article = await db.article.create({
      data: {
        userId,
        title: 'test',
        content: 'test'
      }
    })
    articleId = article.id;
  });

   afterAll(async () => {
    await db.$disconnect();
  });


  test("존재하지 않는 게시글로 상세 조회할 경우", async () => {
    const response = await request(app).get(`/article/detail/${articleId + 1}`)
    expect(response.statusCode).toBe(404);
  });

  test("정상적인 게시글 상세 조회", async () => {
    const response = await request(app).get(`/article/detail/${articleId}`)
    expect(response.statusCode).toBe(200);
  });

});


//  게시글 목록 조회
describe("GET /article/list", () => {

  let userId: number;
  let articleId: number;

  beforeAll(async () => {

    await db.product.deleteMany({});
    await db.article.deleteMany({});
    await db.user.deleteMany({});

    const user = await db.user.create({
      data: {
        email: 'test',
        nickname: 'test',
        password: 'test'
      }
    });
    userId = user.id;
    const article = await db.article.create({
      data: {
        userId,
        title: 'test',
        content: 'test'
      }
    })
    articleId = article.id;
  });

   afterAll(async () => {
    await db.$disconnect();
  });


  test("정상적인 게시글 목록 조회", async () => {
    const response = await request(app)
      .get(`/article/list`)
      .query({
        offset: 0,
        limit: 10,
        order: 'newest'
      });
    expect(response.statusCode).toBe(200);
  });
});

