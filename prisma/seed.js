const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. User 시드 생성
    const user = await prisma.user.create({
        data: {
            email: 'jin@example.com',
            nickname: 'JIN',
            image: 'https://via.placeholder.com/150',
            password: 'hashedpassword123', 
        },
    });

    // 2. Product 시드
    const product = await prisma.product.create({
        data: {
            name: '노트북',
            description: '갤럭시북, 상태 양호',
            price: 700000,
            tags: ['전자기기', '노트북'],
            imageUrl: 'images/laptop.jpg',
            userId: user.id,
        },
    });

    await prisma.productComment.create({
        data: {
            content: '좋은 상품이에요!',
            productId: product.id,
            userId: user.id,
        },
    });

    // 3. Article 시드
    const article = await prisma.article.create({
        data: {
            title: 'Promise.try',
            content: '동기식 콜백 함수 오류처리가 더 쉬워집니다.',
            userId: user.id,
        },
    });

    await prisma.articleComment.create({
        data: {
            content: '흥미로운 글이네요!',
            articleId: article.id,
            userId: user.id,
        },
    });

    console.log('✅ Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
