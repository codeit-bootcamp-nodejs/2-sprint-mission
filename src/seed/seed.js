const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: '노트북', description: '미개봉', price: 900000, tags: ['전자기기'] },
      { name: '자전거', description: '생활 기스', price: 150000, tags: ['운동'] }
    ]
  });

  await prisma.article.create({
    data: {
      title: '가입인사합니다',
      content: '잘 부탁드립니다!'
    }
  });
}

main()
  .then(() => console.log('시드 완료'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());