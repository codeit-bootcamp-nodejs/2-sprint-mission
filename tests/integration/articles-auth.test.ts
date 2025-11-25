import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import {
  createTestApp,
  createTestUser,
  createTestArticle,
  getAuthTokens,
  createCookieString,
} from '../utils/testHelpers';

describe('Articles API - Authenticated Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('POST /articles', () => {
    it('should create an article with authentication', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const articleData = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        image: faker.image.url(),
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', createCookieString(accessToken))
        .send(articleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(articleData.title);
      expect(response.body.content).toBe(articleData.content);
      expect(response.body.likeCount).toBe(0);
      expect(response.body.isLiked).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const articleData = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        image: null,
      };

      const response = await request(app).post('/articles').send(articleData);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const invalidData = {
        title: '',
        content: '',
        image: null,
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', createCookieString(accessToken))
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('should trim whitespace from title', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const articleData = {
        title: '   Trimmed Title   ',
        content: faker.lorem.paragraphs(3),
        image: null,
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', createCookieString(accessToken))
        .send(articleData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Trimmed Title');
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should update own article', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const article = await createTestArticle(user.id);

      const updateData = {
        title: 'Updated Article Title',
        content: 'Updated content',
      };

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', createCookieString(accessToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    it("should return 403 when updating other user's article", async () => {
      const { user: owner } = await createTestUser();
      const { user: otherUser } = await createTestUser();
      const { accessToken } = getAuthTokens(otherUser.id);
      const article = await createTestArticle(owner.id);

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', createCookieString(accessToken))
        .send({ title: 'Hacked Title' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Should be the owner');
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .send({ title: 'New Title' });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent article', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const response = await request(app)
        .patch('/articles/999999')
        .set('Cookie', createCookieString(accessToken))
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete own article', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const article = await createTestArticle(user.id);

      const response = await request(app)
        .delete(`/articles/${article.id}`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(204);

      // 확인: 삭제된 게시글 조회 시 404
      const getResponse = await request(app).get(`/articles/${article.id}`);

      expect(getResponse.status).toBe(404);
    });

    it("should return 403 when deleting other user's article", async () => {
      const { user: owner } = await createTestUser();
      const { user: otherUser } = await createTestUser();
      const { accessToken } = getAuthTokens(otherUser.id);
      const article = await createTestArticle(owner.id);

      const response = await request(app)
        .delete(`/articles/${article.id}`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app).delete(`/articles/${article.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /articles/:id/comments', () => {
    it('should create a comment with authentication', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const article = await createTestArticle(user.id);

      const commentData = {
        content: faker.lorem.sentence(),
      };

      const response = await request(app)
        .post(`/articles/${article.id}/comments`)
        .set('Cookie', createCookieString(accessToken))
        .send(commentData);

      expect(response.status).toBe(201);
      expect(response.body.content).toBe(commentData.content);
      expect(response.body.articleId).toBe(article.id);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app)
        .post(`/articles/${article.id}/comments`)
        .send({ content: 'Test comment' });

      expect(response.status).toBe(401);
    });

    it('should validate comment content', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const article = await createTestArticle(user.id);

      const response = await request(app)
        .post(`/articles/${article.id}/comments`)
        .set('Cookie', createCookieString(accessToken))
        .send({ content: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /articles/:id/likes', () => {
    it('should add like to article', async () => {
      const { user } = await createTestUser();
      const { user: owner } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const article = await createTestArticle(owner.id);

      const response = await request(app)
        .post(`/articles/${article.id}/likes`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(201);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app).post(`/articles/${article.id}/likes`);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /articles/:id/likes', () => {
    it('should remove like from article', async () => {
      const { user } = await createTestUser();
      const { user: owner } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const article = await createTestArticle(owner.id);

      // 먼저 좋아요 추가
      await request(app)
        .post(`/articles/${article.id}/likes`)
        .set('Cookie', createCookieString(accessToken));

      // 좋아요 제거
      const response = await request(app)
        .delete(`/articles/${article.id}/likes`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(204);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const response = await request(app).delete(`/articles/${article.id}/likes`);

      expect(response.status).toBe(401);
    });
  });
});
