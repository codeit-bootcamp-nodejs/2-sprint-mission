const { db } = require('../config/db');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

exports.getAllProducts = async (query) => {
    const skip = Number(query.skip) || 0;
    const limit = Number(query.limit) || 10;
    const keyword = query.keyword || '';

    if (skip < 0 || limit < 0 || isNaN(skip) || isNaN(limit)) {
        const error = new Error();
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

exports.getProductById = async (userId, productId) => {
    const uid = Number(userId);
    const pid = Number(productId);

    if (isNaN(uid) || isNaN(pid)) {
        const error = new Error('유효하지 않은 ID입니다.');
        error.status = 400;
        throw error;
    }

    const product = await db.product.findUnique({
        where: { id: pid },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });

    if (!product) {
        const error = new Error('상품을 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    // 좋아요 여부 확인
    let isLiked = false;
    const like = await db.productLike.findFirst({
        where: {
            productId: pid,
            userId: uid,
        },
    });
    isLiked = !!like;

    return { ...product, isLiked };
};

exports.createProduct = async (data) => {
    const { name, description, price, tags, userId } = data;
    return await db.product.create({ data: { name, description, price, tags, userId } });
};

exports.updateProduct = async (id, data, file) => {
    const product = await db.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
        const error = new Error();
        error.status = 404;
        throw error;
    }

    const dataToUpdate = {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
    };

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

exports.deleteProduct = async (id) => {
    const product = await db.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
        const error = new Error();
        error.status = 404;
        throw error;
    }
    return await db.product.delete({ where: { id: Number(id) } });
};

exports.likeProduct = async (userId, productId) => {
    // 중복 체크
    const likeProduct = await db.productLike.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });

    if (likeProduct) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    const like = await db.productLike.create({
        data: { userId, productId },
    });
    return like;
};

exports.unlikeProduct = async (userId, productId) => {
    const unlikeProduct = await db.productLike.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });

    if (!unlikeProduct) {
        const error = new Error();
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
