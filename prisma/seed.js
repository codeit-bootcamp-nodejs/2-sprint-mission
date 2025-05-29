const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: '맥북 프로',
        description: '중고 모델입니다.',
        price: 1200000,
        tags: ['노트북', '애플']
      },
      {
        name: '에어팟 프로',
        description: '신상 입니다.',
        price: 700000,
        tags: ['이어폰', '애플']
      }
    ]
  });


  await prisma.article.createMany({
    data: [
      {
        title: '1등',
        content: '내가 제일 처음으로 글 씀',
      },
      {
        title: '1등 놀이 애도 아니고',
        content: '그럼 난 2등 ㅋㅋ',
      }
    ]
  });
};

main()
  .then(() => {
    console.log('seeding 완료');
  })
  .catch( (e) => {
    console.error('seeding 실패:', e);
    return prisma.$disconnect().then(() => process.exit(1));
  });
  

  