const { db } = require('../config/db');

exports.getAllArticles = async (query) => {
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
              OR: [{ title: { contains: keyword, mode: 'insensitive' } }, { content: { contains: keyword, mode: 'insensitive' } }],
          }
        : {};

    const articles = await db.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { id: true, title: true, content: true, createdAt: true },
    });

    return articles;
};

exports.getArticleById = async (userId, articleId) => {
    const uid = Number(userId);
    const aid = Number(articleId);

    if (isNaN(aid)) {
        const error = new Error('유효하지 않은 게시글 ID 입니다.');
        error.status = 400;
        throw error;
    }

    const article = await db.article.findUnique({
        where: { id: aid },
        select: {
            id: true,
            title: true,
            content: true,
            userId: true,
        },
    });

    if (!article) {
        const error = new Error('게시글을 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    let isLiked = false;

    if (!isNaN(uid)) {
        const like = await db.articleLike.findFirst({
            where: {
                articleId: aid,
                userId: uid,
            },
        });
        isLiked = !!like;
    }

    return { ...article, isLiked };
};

exports.createArticle = async (data) => {
    const { userId, title, content } = data;
    return await db.article.create({ data: { userId, title, content } });
};

exports.updateArticle = async (id, data) => {
    const article = await db.article.findUnique({ where: { id: Number(id) } });
    if (!article) {
        const error = new Error('해당 게시글을 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    const dataToUpdate = {
        title: data.title,
        content: data.content,
    };

    const updated = await db.article.update({ where: { id: Number(id) }, data: dataToUpdate });
    return { message: 'Successfully updated', article: updated };
};

exports.deleteArticle = async (id) => {
    const article = await db.article.findUnique({ where: { id: Number(id) } });
    if (!article) {
        const error = new Error();
        error.status = 404;
        throw error;
    }
    return await db.article.delete({ where: { id: Number(id) } });
};

exports.likeArticle = async (userId, articleId) => {
    const likeArticle = await db.articleLike.findUnique({
        where: {
            userId_articleId: { userId, articleId },
        },
    });

    if (likeArticle) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    const like = await db.articleLike.create({
        data: { userId, articleId },
    });
    return like;
};

exports.unlikeArticle = async (userId, articleId) => {
    const unlikeArticle = await db.articleLike.findUnique({
        where: {
            userId_articleId: { userId, articleId },
        },
    });

    if (!unlikeArticle) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    await db.articleLike.delete({
        where: {
            userId_articleId: { userId, articleId },
        },
    });
    return { articleId };
};
