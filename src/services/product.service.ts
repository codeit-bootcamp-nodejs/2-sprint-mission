const { db } = require('../config/db');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 상품 전체 목록 조회
exports.getAllProducts = async (query) => {
    const skip = Number(query.skip) || 0;
    const limit = Number(query.limit) || 10;
    const keyword = query.keyword || '';

    if (skip < 0 || limit < 0 || isNaN(skip) || isNaN(limit)) {
        const error = new Error('요청한 페이지 정보 유효하지 않음');
        error.status = 400;
        throw error;
    }

    const where = keyword
        ? {
              OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { description: { contains: keyword, mode: 'insensitive' } }],
          }
        : {};

    return await db.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { id: true, name: true, price: true, createdAt: true },
    });
};

// 상품 상세 목록 조회
exports.getProductById = async (userId, productId) => {
    const uid = Number(userId);
    const pid = Number(productId);

    if (isNaN(pid)) {
        const error = new Error('유효하지 않은 상품 ID');
        error.status = 400;
        throw error;
    }

    const product = await db.product.findUnique({
        where: { id: pid },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            updatedAt: true,
            userId: true,
        },
    });

    if (!product) {
        const error = new Error('조회할 상품 없음');
        error.status = 404;
        throw error;
    }

    let isLiked = false;

    if (!isNaN(uid)) {
        const like = await db.productLike.findFirst({
            where: {
                productId: pid,
                userId: uid,
            },
        });
        isLiked = !!like;
    }

    return { ...product, isLiked };
};

// 상품 생성
exports.createProduct = async (data) => {
    const { name, description, price, tags, userId } = data;
    return await db.product.create({ data: { name, description, price, tags, userId } });
};

// 상품 수정
exports.updateProduct = async (id, data, file) => {
    const product = await db.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
        const error = new Error('수정할 상품 없음');
        error.status = 404;
        throw error;
    }

    const dataToUpdate = {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
    };

    // 파일 업로드 처리 (지금은 생략 가능)
    if (file) {
        const { originalname, filename } = file;
        const ext = path.extname(originalname);
        const newName = filename + ext;
        const newPath = path.join(uploadDir, newName);
        fs.renameSync(file.path, newPath);
        dataToUpdate.imageUrl = `/product/files/${newName}`;
    }

    return await db.product.update({ where: { id: Number(id) }, data: dataToUpdate });
};

// 상품 삭제
exports.deleteProduct = async (id) => {
    const product = await db.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
        const error = new Error('삭제할 상품 없음');
        error.status = 404;
        throw error;
    }
    return await db.product.delete({ where: { id: Number(id) } });
};

// 게시글 좋아요♥️
exports.likeProduct = async (userId, productId) => {
    // 중복 체크
    const likeProduct = await db.productLike.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });

    if (likeProduct) {
        const error = new Error('이미 좋아요 했지~♥️');
        error.status = 400;
        throw error;
    }

    const like = await db.productLike.create({
        data: { userId, productId },
    });
    return like;
};

// 게시글 좋아요❌
exports.unlikeProduct = async (userId, productId) => {
    const unlikeProduct = await db.productLike.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });

    if (!unlikeProduct) {
        const error = new Error('아직 좋아요 안했지~♥️');
        error.status = 400;
        throw error;
    }

    await db.productLike.delete({
        where: {
            userId_productId: { userId, productId },
        },
    });
    return { productId };
};
