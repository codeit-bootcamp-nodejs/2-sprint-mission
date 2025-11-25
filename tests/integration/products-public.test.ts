import request from 'supertest';
import { Express } from 'express';
import {
  createTestApp,
  createTestUser,
  createTestProduct,
  createTestComment,
} from '../utils/testHelpers';

describe('Products API - Public Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /products', () => {
    it('should get product list without authentication', async () => {
      const { user } = await createTestUser();
      await createTestProduct(user.id);
      await createTestProduct(user.id);
      await createTestProduct(user.id);

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body.list).toHaveLength(3);
    });

    it('should support pagination', async () => {
      const { user } = await createTestUser();

      // 15개 상품 생성
      for (let i = 0; i < 15; i++) {
        await createTestProduct(user.id);
      }

      // 첫 페이지
      const response1 = await request(app).get('/products').query({ page: 1, pageSize: 5 });

      expect(response1.status).toBe(200);
      expect(response1.body.list).toHaveLength(5);
      expect(response1.body.totalCount).toBe(15);

      // 두 번째 페이지
      const response2 = await request(app).get('/products').query({ page: 2, pageSize: 5 });

      expect(response2.status).toBe(200);
      expect(response2.body.list).toHaveLength(5);
      expect(response2.body.list[0].id).not.toBe(response1.body.list[0].id);
    });

    it('should support keyword search', async () => {
      const { user } = await createTestUser();
      await createTestProduct(user.id, { name: 'Special iPhone 15' });
      await createTestProduct(user.id, { name: 'Samsung Galaxy' });
      await createTestProduct(user.id, { name: 'iPad Pro' });

      const response = await request(app).get('/products').query({ keyword: 'iPhone' });

      expect(response.status).toBe(200);
      expect(response.body.list).toHaveLength(1);
      expect(response.body.list[0].name).toContain('iPhone');
    });

    it('should order by recent when specified', async () => {
      const { user } = await createTestUser();
      const product1 = await createTestProduct(user.id);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const product2 = await createTestProduct(user.id);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const product3 = await createTestProduct(user.id);

      const response = await request(app).get('/products').query({ orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body.list[0].id).toBe(product3.id);
      expect(response.body.list[1].id).toBe(product2.id);
      expect(response.body.list[2].id).toBe(product1.id);
    });
  });

  describe('GET /products/:id', () => {
    it('should get product detail without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app).get(`/products/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(product.name);
      expect(response.body).toHaveProperty('favoriteCount');
      expect(response.body).toHaveProperty('isFavorited');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/999999');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid product id', async () => {
      const response = await request(app).get('/products/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /products/:id/comments', () => {
    it('should get product comments without authentication', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      await createTestComment(user.id, product.id, 'product');
      await createTestComment(user.id, product.id, 'product');
      await createTestComment(user.id, product.id, 'product');

      const response = await request(app).get(`/products/${product.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('nextCursor');
      expect(response.body.list).toHaveLength(3);
    });

    it('should support cursor-based pagination', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      // 15개 댓글 생성
      for (let i = 0; i < 15; i++) {
        await createTestComment(user.id, product.id, 'product');
      }

      // 첫 페이지
      const response1 = await request(app)
        .get(`/products/${product.id}/comments`)
        .query({ limit: 5 });

      expect(response1.status).toBe(200);
      expect(response1.body.list).toHaveLength(5);
      expect(response1.body.nextCursor).toBeDefined();

      // 두 번째 페이지
      const response2 = await request(app)
        .get(`/products/${product.id}/comments`)
        .query({ cursor: response1.body.nextCursor, limit: 5 });

      expect(response2.status).toBe(200);
      expect(response2.body.list).toHaveLength(5);
      expect(response2.body.list[0].id).not.toBe(response1.body.list[0].id);
    });

    it('should return empty list for product without comments', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const response = await request(app).get(`/products/${product.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.list).toHaveLength(0);
      expect(response.body.nextCursor).toBeNull();
    });
  });
});
