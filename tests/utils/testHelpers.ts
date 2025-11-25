import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Import routers with proper paths
const articlesRouter = require('../../src/routers/articlesRouter').default;
const productsRouter = require('../../src/routers/productsRouter').default;
const authRouter = require('../../src/routers/authRouter').default;
const commentsRouter = require('../../src/routers/commentsRouter').default;
const { globalErrorHandler } = require('../../src/controllers/errorController');

const prisma = new PrismaClient();

// 테스트용 Express 앱 생성
export function createTestApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/articles', articlesRouter);
  app.use('/products', productsRouter);
  app.use('/auth', authRouter);
  app.use('/comments', commentsRouter);

  app.use(globalErrorHandler);

  return app;
}

// 테스트용 사용자 생성
export async function createTestUser(overrides = {}) {
  const password = faker.internet.password();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      nickname: faker.person.firstName(),
      password: hashedPassword,
      image: faker.image.avatar(),
      ...overrides,
    },
  });

  return { user, password };
}

// 인증된 사용자 토큰 생성
export function getAuthTokens(userId: number) {
  const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'test-access-secret-key';
  const JWT_REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_TOKEN_SECRET || 'test-refresh-secret-key';

  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

// 테스트용 상품 생성
export async function createTestProduct(userId: number, overrides = {}) {
  return await prisma.product.create({
    data: {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseInt(faker.commerce.price({ min: 1000, max: 100000, dec: 0 })),
      tags: [faker.commerce.department(), faker.commerce.productAdjective()],
      images: [faker.image.url()],
      userId,
      ...overrides,
    },
  });
}

// 테스트용 게시글 생성
export async function createTestArticle(userId: number, overrides = {}) {
  return await prisma.article.create({
    data: {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      image: faker.image.url(),
      userId,
      ...overrides,
    },
  });
}

// 테스트용 댓글 생성
export async function createTestComment(
  userId: number,
  targetId: number,
  type: 'product' | 'article',
) {
  const data: any = {
    content: faker.lorem.sentence(),
    userId,
  };

  if (type === 'product') {
    data.productId = targetId;
  } else {
    data.articleId = targetId;
  }

  return await prisma.comment.create({ data });
}

// 쿠키 문자열 생성 (constants.ts의 쿠키 이름과 일치)
export function createCookieString(accessToken: string, refreshToken?: string): string {
  let cookie = `access-token=${accessToken}`;
  if (refreshToken) {
    cookie += `; refresh-token=${refreshToken}`;
  }
  return cookie;
}
