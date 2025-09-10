import request from 'supertest';
import app from '../src/app';



describe('Public APIs', () => {

  // 상품 API 테스트
  describe('Product API - Unauthenticated', () => {
    it('GET /products: 모든 상품 목록을 가져와야 합니다', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /products/:id: 특정 상품의 상세 정보를 가져와야 합니다', async () => {
      // 실제 상품 ID를 사용하거나, 테스트용 상품을 생성.
      const productId = 1;
      const response = await request(app).get(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', productId);
    });
  });

  // 게시글 API 테스트
  describe('Article API - Unauthenticated', () => {
    it('GET /articles: 모든 게시글 목록을 가져와야 합니다', async () => {
      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /articles/:id: 특정 게시글의 상세 정보를 가져와야 합니다', async () => {
      // 실제 게시글 ID를 사용하거나, 테스트용 게시글을 생성해야 합니다.
      const articleId = 1;
      const response = await request(app).get(`/articles/${articleId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', articleId);
    });
  });
});

// -------------------------------------------------------------
// 인증이 필요한 API에 대한 통합 테스트
// -------------------------------------------------------------
describe('Authenticated APIs', () => {
  let userToken: string;
  let testProductId: number;
  let testArticleId: number;

  beforeAll(async () => {
    // 테스트용 사용자 회원가입 및 로그인
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ email: 'test@gmail.com', password: 'test123' });
    
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'test123' });
      
    userToken = loginResponse.body.token;

    // 테스트용 상품 및 게시글 생성
    const productCreation = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Test Product', price: 10000 });
    testProductId = productCreation.body.data.id;
    
    const articleCreation = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Test Article', content: 'This is a test content.' });
    testArticleId = articleCreation.body.data.id;
  });

  afterAll(async () => {
    // 테스트 후 생성된 데이터 정리 (실제 DB에 맞게 수정 필요)
    // 예시: 상품 및 게시글 삭제 API 호출
    await request(app).delete(`/products/${testProductId}`).set('Authorization', `Bearer ${userToken}`);
    await request(app).delete(`/articles/${testArticleId}`).set('Authorization', `Bearer ${userToken}`);
  });

  // 상품 API 테스트
  describe('Product API - Authenticated', () => {
    it('POST /products: 새 상품을 생성해야 합니다', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'New Product', price: 20000 });
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('name', 'New Product');
    });

    it('PUT /products/:id: 상품을 수정해야 합니다', async () => {
      const response = await request(app)
        .put(`/products/${testProductId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 15000 });
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('price', 15000);
    });

    it('DELETE /products/:id: 상품을 삭제해야 합니다', async () => {
      const response = await request(app)
        .delete(`/products/${testProductId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(204);
    });
  });

  // 게시글 API 테스트
  describe('Article API - Authenticated', () => {
    it('POST /articles: 새 게시글을 생성해야 합니다', async () => {
      const response = await request(app)
        .post('/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'New Article', content: 'This is a new article.' });
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('title', 'New Article');
    });
    
    it('PUT /articles/:id: 게시글을 수정해야 합니다', async () => {
      const response = await request(app)
        .put(`/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content: 'Updated content.' });
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('content', 'Updated content.');
    });

    it('DELETE /articles/:id: 게시글을 삭제해야 합니다', async () => {
      const response = await request(app)
        .delete(`/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(204);
    });
  });
});