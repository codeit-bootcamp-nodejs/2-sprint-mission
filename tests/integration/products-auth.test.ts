import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import {
  createTestApp,
  createTestUser,
  createTestProduct,
  getAuthTokens,
  createCookieString,
} from '../utils/testHelpers';

describe('Products API - Authenticated Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('POST /products', () => {
    it('should create a product with authentication', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const productData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: 10000,
        tags: ['electronics', 'gadget'],
        images: [faker.image.url()],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', createCookieString(accessToken))
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.favoriteCount).toBe(0);
      expect(response.body.isFavorited).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const productData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: 10000,
        tags: ['electronics'],
        images: [faker.image.url()],
      };

      const response = await request(app).post('/products').send(productData);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const invalidData = {
        name: '',
        description: '',
        price: -1000,
        tags: [],
        images: [],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', createCookieString(accessToken))
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update own product', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const product = await createTestProduct(user.id);

      const updateData = {
        name: 'Updated Product Name',
        price: 20000,
      };

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .set('Cookie', createCookieString(accessToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
    });

    it("should return 403 when updating other user's product", async () => {
      const { user: owner } = await createTestUser();
      const { user: otherUser } = await createTestUser();
      const { accessToken } = getAuthTokens(otherUser.id);
      const product = await createTestProduct(owner.id);

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .set('Cookie', createCookieString(accessToken))
        .send({ name: 'Hacked Name' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Should be the owner');
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent product', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);

      const response = await request(app)
        .patch('/products/999999')
        .set('Cookie', createCookieString(accessToken))
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete own product', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const product = await createTestProduct(user.id);

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(204);

      // 확인: 삭제된 상품 조회 시 404
      const getResponse = await request(app).get(`/products/${product.id}`);

      expect(getResponse.status).toBe(404);
    });

    it("should return 403 when deleting other user's product", async () => {
      const { user: owner } = await createTestUser();
      const { user: otherUser } = await createTestUser();
      const { accessToken } = getAuthTokens(otherUser.id);
      const product = await createTestProduct(owner.id);

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app).delete(`/products/${product.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /products/:id/comments', () => {
    it('should create a comment with authentication', async () => {
      const { user } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const product = await createTestProduct(user.id);

      const commentData = {
        content: faker.lorem.sentence(),
        productId: product.id,
      };

      const response = await request(app)
        .post(`/products/${product.id}/comments`)
        .set('Cookie', createCookieString(accessToken))
        .send(commentData);

      expect(response.status).toBe(201);
      expect(response.body.content).toBe(commentData.content);
      expect(response.body.productId).toBe(product.id);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app)
        .post(`/products/${product.id}/comments`)
        .send({ content: 'Test comment' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /products/:id/favorites', () => {
    it('should add product to favorites', async () => {
      const { user } = await createTestUser();
      const { user: owner } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const product = await createTestProduct(owner.id);

      const response = await request(app)
        .post(`/products/${product.id}/favorites`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(201);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app).post(`/products/${product.id}/favorites`);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /products/:id/favorites', () => {
    it('should remove product from favorites', async () => {
      const { user } = await createTestUser();
      const { user: owner } = await createTestUser();
      const { accessToken } = getAuthTokens(user.id);
      const product = await createTestProduct(owner.id);

      // 먼저 즐겨찾기 추가
      await request(app)
        .post(`/products/${product.id}/favorites`)
        .set('Cookie', createCookieString(accessToken));

      // 즐겨찾기 제거
      const response = await request(app)
        .delete(`/products/${product.id}/favorites`)
        .set('Cookie', createCookieString(accessToken));

      expect(response.status).toBe(204);
    });

    it('should return 401 without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app).delete(`/products/${product.id}/favorites`);

      expect(response.status).toBe(401);
    });
  });
});
