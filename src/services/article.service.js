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

exports.getArticleById = async (id) => {
    const article = await db.article.findUnique({ where: { id: Number(id) } });
    if (!article) {
        const error = new Error();
        error.status = 404;
        throw error;
    }
    const { id: aid, title, content, createdAt } = article;
    return { id: aid, title, content, createdAt };
};

exports.createArticle = async (data) => {
    const { title, content } = data;
    await db.article.create({ data: { title, content } });
    return { message: 'Successfully registered' };
};

exports.updateArticle = async (id, data) => {
    const article = await db.article.findUnique({ where: { id: Number(id) } });
    if (!article) {
        const error = new Error();
        error.status = 404;
        throw error;
    }

    const updated = await db.article.update({ where: { id: Number(id) }, data });
    return { message: 'Successfully updated', article: updated };
};

exports.deleteArticle = async (id) => {
    const article = await db.article.findUnique({ where: { id: Number(id) } });
    if (!article) {
        const error = new Error();
        error.status = 404;
        throw error;
    }
    await db.article.delete({ where: { id: Number(id) } });
    return { message: 'Successfully deleted' };
};
