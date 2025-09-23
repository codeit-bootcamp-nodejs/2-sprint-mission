import request from 'supertest';
import { Express } from 'express';
import {
  createTestApp,
  createTestUser,
  createTestArticle,
  createTestComment,
} from '../utils/testHelpers';

describe('Articles API - Public Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /articles', () => {
    it('should get article list without authentication', async () => {
      const { user } = await createTestUser();
      await createTestArticle(user.id);
      await createTestArticle(user.id);
      await createTestArticle(user.id);

      const response = await request(app).get('/articles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body.list).toHaveLength(3);
    });

    it('should support pagination', async () => {
      const { user } = await createTestUser();

      // 15개 게시글 생성
      for (let i = 0; i < 15; i++) {
        await createTestArticle(user.id);
      }

      // 첫 페이지
      const response1 = await request(app).get('/articles').query({ page: 1, pageSize: 5 });

      expect(response1.status).toBe(200);
      expect(response1.body.list).toHaveLength(5);
      expect(response1.body.totalCount).toBe(15);

      // 두 번째 페이지
      const response2 = await request(app).get('/articles').query({ page: 2, pageSize: 5 });

      expect(response2.status).toBe(200);
      expect(response2.body.list).toHaveLength(5);
      expect(response2.body.list[0].id).not.toBe(response1.body.list[0].id);
    });

    it('should support keyword search', async () => {
      const { user } = await createTestUser();
      await createTestArticle(user.id, { title: 'JavaScript Tutorial' });
      await createTestArticle(user.id, { title: 'Python Guide' });
      await createTestArticle(user.id, { title: 'JavaScript Advanced' });

      const response = await request(app).get('/articles').query({ keyword: 'JavaScript' });

      expect(response.status).toBe(200);
      expect(response.body.list).toHaveLength(2);
      response.body.list.forEach((article: any) => {
        expect(article.title).toContain('JavaScript');
      });
    });

    it('should order by recent when specified', async () => {
      const { user } = await createTestUser();
      const article1 = await createTestArticle(user.id);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const article2 = await createTestArticle(user.id);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const article3 = await createTestArticle(user.id);

      const response = await request(app).get('/articles').query({ orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body.list[0].id).toBe(article3.id);
      expect(response.body.list[1].id).toBe(article2.id);
      expect(response.body.list[2].id).toBe(article1.id);
    });
  });

  describe('GET /articles/:id', () => {
    it('should get article detail without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app).get(`/articles/${article.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(article.id);
      expect(response.body.title).toBe(article.title);
      expect(response.body).toHaveProperty('likeCount');
      expect(response.body).toHaveProperty('isLiked');
    });

    it('should return 404 for non-existent article', async () => {
      const response = await request(app).get('/articles/999999');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid article id', async () => {
      const response = await request(app).get('/articles/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /articles/:id/comments', () => {
    it('should get article comments without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      await createTestComment(user.id, article.id, 'article');
      await createTestComment(user.id, article.id, 'article');
      await createTestComment(user.id, article.id, 'article');

      const response = await request(app).get(`/articles/${article.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('nextCursor');
      expect(response.body.list).toHaveLength(3);
    });

    it('should support cursor-based pagination', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      // 15개 댓글 생성
      for (let i = 0; i < 15; i++) {
        await createTestComment(user.id, article.id, 'article');
      }

      // 첫 페이지
      const response1 = await request(app)
        .get(`/articles/${article.id}/comments`)
        .query({ limit: 5 });

      expect(response1.status).toBe(200);
      expect(response1.body.list).toHaveLength(5);
      expect(response1.body.nextCursor).toBeDefined();

      // 두 번째 페이지
      const response2 = await request(app)
        .get(`/articles/${article.id}/comments`)
        .query({ cursor: response1.body.nextCursor, limit: 5 });

      expect(response2.status).toBe(200);
      expect(response2.body.list).toHaveLength(5);
      expect(response2.body.list[0].id).not.toBe(response1.body.list[0].id);
    });

    it('should return empty list for article without comments', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app).get(`/articles/${article.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.list).toHaveLength(0);
      expect(response.body.nextCursor).toBeNull();
    });
  });
});
