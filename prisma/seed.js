const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const sample = require('./mock');
const bcrypt = require('bcrypt');

const main = async () => {
  console.log('DB 시딩 시작');
  
  // 기존 데이터 삭제 (외래키 제약조건 때문에 순서가 중요)
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('기존 데이터 삭제 완료');

  // 시딩 데이터 삽입
  
  // 1. 먼저 사용자 생성
  console.log('사용자 데이터 삽입 중...');
  const users = await Promise.all(
    sample.users.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10), // 비밀번호가 없으면 기본값 설정
    }))
  );
  await prisma.user.createMany({ data: users });
  
  // 2. 상품 생성 (사용자가 필요)
  console.log('상품 데이터 삽입 중...');
  await prisma.product.createMany({ data: sample.products });
  
  // 3. 게시글 생성 (사용자가 필요)
  console.log('게시글 데이터 삽입 중...');
  await prisma.article.createMany({ data: sample.articles });
  
  // 4. 댓글 생성 (사용자, 상품, 게시글이 필요)
  console.log('댓글 데이터 삽입 중...');
  await prisma.comment.createMany({ data: sample.comments });
  
  // 5. 좋아요 생성 (사용자, 상품, 게시글이 필요)
  console.log('좋아요 데이터 삽입 중...');
  await prisma.like.createMany({ data: sample.likes });

  console.log('모든 시딩 데이터 삽입 완료');
};

main()
  .then(() => {
    console.log('DB 시딩 완료');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('시딩 중 오류 발생:', e);
    return prisma.$disconnect();
  })
  .finally(async () => {
    await prisma.$disconnect();
  });