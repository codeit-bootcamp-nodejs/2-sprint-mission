import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// 테스트 환경 변수 설정
dotenv.config({ path: '.env.test' });

// 테스트용 Prisma Client (단일 인스턴스)
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// 데이터베이스 정리 함수
async function cleanDatabase() {
  try {
    // TRUNCATE를 사용한 빠른 초기화 시도
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "Notification", 
        "Like", 
        "Favorite", 
        "Comment", 
        "Article", 
        "Product", 
        "User" 
      CASCADE;
    `);
  } catch (error) {
    console.log('TRUNCATE failed, using deleteMany instead');
    // TRUNCATE 실패시 deleteMany 사용
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.like.deleteMany(),
      prisma.favorite.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.article.deleteMany(),
      prisma.product.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  }
}

// 각 테스트 전에 데이터베이스 정리
beforeEach(async () => {
  await cleanDatabase();
});

// 모든 테스트 완료 후 연결 종료
afterAll(async () => {
  await prisma.$disconnect();
});
