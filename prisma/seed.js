const { PrismaClient } = require('../generated/prisma'); // generated된 prisma 가져옴
const prisma = new PrismaClient();

async function main() {
    // 기존 데이터 비우기
    await prisma.$transaction([prisma.product.deleteMany(), prisma.article.deleteMany(), prisma.comment.deleteMany()]);
    // 시퀀스 초기화
    await prisma.$executeRawUnsafe('TRUNCATE "Product","Article","Comment" RESTART IDENTITY CASCADE');

    // product data
    const product = await prisma.product.createMany({
        data: [
            {
                name: '노트북',
                description: '갤럭시북, 상태 양호',
                price: 700000,
                tags: ['전자기기', '노트북'],
                imageUrl: 'images/laptop.jpg',
            },
        ],
    });

    // article data
    const article = await prisma.article.createMany({
        data: [{ title: '게시글 1', content: '본문' }],
    });

    // comment data
    const comment = await prisma.comment.createMany({
        data: [
            { content: '댓글1', productId: 1 },
            { content: '댓글2', articleId: 1 },
        ],
    });
    console.log({ product, article, comment });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
