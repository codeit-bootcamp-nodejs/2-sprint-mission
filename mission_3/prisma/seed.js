import { PrismaClient } from '@prisma/client';
import {
  PRODUCTS,
  PRODCOMMENTS,
  ARTICLES,
  ARTICOMMENTS,
} from './mock.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.prodComment.deleteMany();
  await prisma.artiComment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  // 목 데이터 삽입
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.prodComment.createMany({
    data: PRODCOMMENTS,
    skipDuplicates: true,
  });
  
  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });
  
  await prisma.artiComment.createMany({
    data: ARTICOMMENTS,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
