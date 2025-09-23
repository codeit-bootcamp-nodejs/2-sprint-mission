import { db } from '../utils/db';

beforeAll(async () => {
  // 테스트 데이터베이스 연결
  await db.$connect();
});

afterAll(async () => {
  // 테스트 완료 후 데이터베이스 연결 해제
  await db.$disconnect();
});

// 각 테스트 전 데이터 정리
beforeEach(async () => {
  await db.notification.deleteMany({});
  await db.like.deleteMany({});
  await db.comment.deleteMany({});
  await db.article.deleteMany({});
  await db.product.deleteMany({});
  await db.user.deleteMany({});
});