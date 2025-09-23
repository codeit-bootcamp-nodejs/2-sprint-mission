import 'dotenv/config'; // 옵션: .env 자동 로드
import { PrismaClient, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding start');

  // 개발 DB 전용: 기존 데이터 정리 (FK 순서 주의)
  await prisma.$transaction([
    prisma.refreshToken.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.productLike.deleteMany(),
    prisma.articleLike.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.product.deleteMany(),
    prisma.article.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // 1) 사용자 2명
  const hash = await bcrypt.hash('pass1234', 12);
  const user1 = await prisma.user.create({
    data: { email: 'user1@example.com', nickname: 'user1', password: hash, image: null },
  });
  const user2 = await prisma.user.create({
    data: { email: 'user2@example.com', nickname: 'user2', password: hash, image: null },
  });

  // 2) 상품 2개
  const p1 = await prisma.product.create({
    data: {
      name: '시드 상품 1',
      description: 'user1의 상품',
      price: 10000,
      tags: ['electronics', 'hot'],
      imageUrl: 'https://picsum.photos/seed/p1/640/480',
      ownerId: user1.id,
    },
  });
  const p2 = await prisma.product.create({
    data: {
      name: '시드 상품 2',
      description: 'user2의 상품',
      price: 23000,
      tags: ['fashion'],
      imageUrl: 'https://picsum.photos/seed/p2/640/480',
      ownerId: user2.id,
    },
  });

  // 3) 좋아요 (user2 → user1의 상품)
  await prisma.productLike.create({ data: { userId: user2.id, productId: p1.id } });

  // 4) 게시글 + 댓글 (user1의 글에 user2가 댓글)
  const a1 = await prisma.article.create({
    data: { title: '시드 글 1', content: '알림 테스트용 글', authorId: user1.id, imageUrl: null },
  });
  const c1 = await prisma.comment.create({
    data: { content: '시드 댓글 by user2', authorId: user2.id, articleId: a1.id, productId: null },
  });

  // 5) 샘플 알림 2개 (link는 사용하지 않으므로 넣지 않음)
  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: NotificationType.NEW_COMMENT,
      title: '새 댓글이 달렸어요',
      message: `내 게시글 "${a1.title}"에 새 댓글이 달렸습니다.`,
      articleId: a1.id,
      commentId: c1.id,
    },
  });
  await prisma.notification.create({
    data: {
      userId: user2.id,
      type: NotificationType.PRICE_CHANGED,
      title: '관심 상품 가격 변동',
      message: `${p1.name} 가격이 10,000 → 15,000 으로 변경되었어요.`,
      productId: p1.id,
      readAt: new Date(), // 읽음 처리된 샘플
    },
  });

  console.log('✅ Seed done.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });