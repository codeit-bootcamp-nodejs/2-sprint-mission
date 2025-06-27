const bcrypt = require('bcrypt');
const { db } = require('../config/db');

exports.getMyInfo = async (userId) => {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
        },
    });
    return user;
};

exports.updateMyInfo = async (userId, data) => {
    const updated = await db.user.update({
        where: { id: userId },
        data: {
            nickname: data.nickname,
            imageUrl: data.imageUrl,
        },
        select: {
            nickname: true,
            image: true,
        },
    });
    return updated;
};

exports.updateMyPw = async (userId, currentPassword, newPassword) => {
    // 1. 유저 정보 불러오기
    const user = await db.user.findUnique({ where: { id: userId } });

    // 2. 현재 비밀번호 확인
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        const error = new Error('현재 비밀번호가 일치하지 않습니다.');
        error.status = 403;
        throw error;
    }

    // 3. 새 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. 비밀번호 업데이트
    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
};

exports.getMyProducts = async (userId) => {
    // console.log('조회할 userId:', userId);

    const products = await db.product.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
    });
    // console.log('조회된 상품 수:', products.length);

    return products;
};

exports.getMyArticles = async (userId) => {
    const articles = await db.article.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
    });
    return articles;
};

exports.getMyComments = async (userId) => {
    const productComments = await db.productComment.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
    });

    const articleComments = await db.articleComment.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
    });
    return { productComments, articleComments };
};

exports.getLikedProducts = async (userId) => {
    const likes = await db.productLike.findMany({
        where: { userId: Number(userId) },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    return likes.map((like) => like.product);
};

exports.getLikedArticles = async (userId) => {
    const likes = await db.articleLike.findMany({
        where: { userId: Number(userId) },
        include: {
            article: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    return likes.map((like) => like.article);
};
