import request from 'supertest';
import app from '../app';
import { db } from '../utils/db';

describe("게시글 API 테스트", () => {
  let testUser: any;
  let authCookies: string;

  beforeEach(async () => {
    // 테스트용 사용자 생성
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('test123', 10);

    testUser = await db.user.create({
      data: {
        email: "test@example.com",
        nickname: "테스트유저",
        password: hashedPassword
      }
    });

    // 로그인하여 쿠키 얻기
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: "test@example.com",
        password: "test123"
      });

    authCookies = loginRes.headers['set-cookie'];
  });

  describe("POST /articles - 게시글 등록", () => {
    it("인증된 사용자가 게시글을 성공적으로 등록할 수 있다", async () => {
      const articleData = {
        title: "테스트 게시글",
        content: "테스트 내용입니다."
      };

      const res = await request(app)
        .post('/articles')
        .set('Cookie', authCookies)
        .send(articleData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("게시글이 등록되었습니다.");
      expect(res.body.newArticle).toEqual({
        id: expect.any(Number),
        title: articleData.title,
        content: articleData.content,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        userId: testUser.id
      });
    });

    it("인증되지 않은 사용자는 게시글을 등록할 수 없다", async () => {
      const articleData = {
        title: "테스트 게시글",
        content: "테스트 내용입니다."
      };

      const res = await request(app)
        .post('/articles')
        .send(articleData);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("액세스 토큰이 없습니다.");
    });

    it("필수 필드가 누락된 경우 400 에러를 반환한다", async () => {
      const articleData = {
        title: "테스트 게시글"
        // content 누락
      };

      const res = await request(app)
        .post('/articles')
        .set('Cookie', authCookies)
        .send(articleData);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("유효하지 않은 입력 값입니다.");
    });
  });

  describe("GET /articles - 게시글 목록 조회", () => {
    beforeEach(async () => {
      // 테스트용 게시글 생성
      await db.article.createMany({
        data: [
          {
            title: "첫 번째 게시글",
            content: "첫 번째 내용",
            userId: testUser.id
          },
          {
            title: "두 번째 게시글",
            content: "두 번째 내용",
            userId: testUser.id
          }
        ]
      });
    });

    it("게시글 목록을 성공적으로 조회할 수 있다", async () => {
      const res = await request(app)
        .get('/articles');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(String),
        nickname: testUser.nickname,
        likeCount: 0,
        isLiked: false
      });
    });

    it("검색어로 게시글을 필터링할 수 있다", async () => {
      const res = await request(app)
        .get('/articles?search=첫 번째');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe("첫 번째 게시글");
    });

    it("페이지네이션이 올바르게 작동한다", async () => {
      const res = await request(app)
        .get('/articles?limit=1&offset=0');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /articles/:id - 게시글 상세 조회", () => {
    let testArticle: any;

    beforeEach(async () => {
      testArticle = await db.article.create({
        data: {
          title: "테스트 게시글",
          content: "테스트 내용",
          userId: testUser.id
        }
      });
    });

    it("게시글 상세 정보를 성공적으로 조회할 수 있다", async () => {
      const res = await request(app)
        .get(`/articles/${testArticle.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: testArticle.id,
        title: testArticle.title,
        content: testArticle.content,
        createdAt: expect.any(String),
        nickname: testUser.nickname,
        likeCount: 0,
        isLiked: false
      });
    });

    it("존재하지 않는 게시글 조회 시 404 에러를 반환한다", async () => {
      const res = await request(app)
        .get('/articles/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("게시글이 존재하지 않습니다.");
    });

    it("유효하지 않은 ID로 조회 시 400 에러를 반환한다", async () => {
      const res = await request(app)
        .get('/articles/invalid');

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("유효하지 않은 ID입니다.");
    });
  });

  describe("PATCH /articles/:id - 게시글 수정", () => {
    let testArticle: any;

    beforeEach(async () => {
      testArticle = await db.article.create({
        data: {
          title: "원본 제목",
          content: "원본 내용",
          userId: testUser.id
        }
      });
    });

    it("게시글 작성자가 게시글을 성공적으로 수정할 수 있다", async () => {
      const updateData = {
        title: "수정된 제목",
        content: "수정된 내용"
      };

      const res = await request(app)
        .patch(`/articles/${testArticle.id}`)
        .set('Cookie', authCookies)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updateData.title);
      expect(res.body.content).toBe(updateData.content);
    });

    it("인증되지 않은 사용자는 게시글을 수정할 수 없다", async () => {
      const updateData = {
        title: "수정된 제목"
      };

      const res = await request(app)
        .patch(`/articles/${testArticle.id}`)
        .send(updateData);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("액세스 토큰이 없습니다.");
    });

    it("다른 사용자의 게시글은 수정할 수 없다", async () => {
      const otherUser = await db.user.create({
        data: {
          email: "other@example.com",
          nickname: "다른유저",
          password: "$2b$10$hashedpassword"
        }
      });

      const otherArticle = await db.article.create({
        data: {
          title: "다른 사용자 게시글",
          content: "다른 사용자 내용",
          userId: otherUser.id
        }
      });

      const updateData = {
        title: "수정 시도"
      };

      const res = await request(app)
        .patch(`/articles/${otherArticle.id}`)
        .set('Cookie', authCookies)
        .send(updateData);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("게시글 수정 권한이 없습니다.");
    });
  });

  describe("DELETE /articles/:id - 게시글 삭제", () => {
    let testArticle: any;

    beforeEach(async () => {
      testArticle = await db.article.create({
        data: {
          title: "삭제할 게시글",
          content: "삭제할 내용",
          userId: testUser.id
        }
      });
    });

    it("게시글 작성자가 게시글을 성공적으로 삭제할 수 있다", async () => {
      const res = await request(app)
        .delete(`/articles/${testArticle.id}`)
        .set('Cookie', authCookies);

      expect(res.statusCode).toBe(204);
    });

    it("인증되지 않은 사용자는 게시글을 삭제할 수 없다", async () => {
      const res = await request(app)
        .delete(`/articles/${testArticle.id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("액세스 토큰이 없습니다.");
    });

    it("다른 사용자의 게시글은 삭제할 수 없다", async () => {
      const otherUser = await db.user.create({
        data: {
          email: "other@example.com",
          nickname: "다른유저",
          password: "$2b$10$hashedpassword"
        }
      });

      const otherArticle = await db.article.create({
        data: {
          title: "다른 사용자 게시글",
          content: "다른 사용자 내용",
          userId: otherUser.id
        }
      });

      const res = await request(app)
        .delete(`/articles/${otherArticle.id}`)
        .set('Cookie', authCookies);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("게시글 삭제 권한이 없습니다.");
    });
  });
});