const { db } = require('../config/db');

exports.getAllProductComments = async (productId, query) => {
    const id = Number(productId);
    const limit = parseInt(query.limit) || 10;
    const cursor = query.cursor ? parseInt(query.cursor) : null;

    if (!id || isNaN(id)) throw Object.assign(new Error(), { status: 404 });

    const product = await db.product.findUnique({ where: { id } });
    if (!product) throw Object.assign(new Error(), { status: 404 });

    const comments = await db.productComment.findMany({
        where: { productId: id },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'desc' },
        select: { id: true, content: true, createdAt: true },
    });

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
    return { comments, nextCursor };
};

exports.createProductComment = async (productId, content, userId) => {
    const id = Number(productId);
    if (!content || !id || isNaN(id)) {
        const error = new Error('Invalid input');
        error.status = 404;
        throw error;
    }

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    return await db.productComment.create({
        data: {
            content,
            user: { connect: { id: userId } },
            product: { connect: { id } },
        },
    });
};

exports.updateProductComment = async (productId, commentId, content, userId) => {
    const pid = Number(productId);
    const cid = Number(commentId);
    const uid = Number(userId);

    // console.log('productId', pid);
    // console.log('commentId', cid);
    // console.log('userId', uid);

    if (!content || isNaN(pid) || isNaN(cid) || isNaN(uid)) {
        const error = new Error('Invalid input');
        error.status = 400;
        throw error;
    }

    const comment = await db.productComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('Comment not found');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('Unauthorized : Not your comment');
        error.status = 403;
        throw error;
    }

    if (comment.productId !== pid) {
        const error = new Error('Unauthorized');
        error.status = 403;
        throw error;
    }

    return await db.productComment.update({ where: { id: cid }, data: { content } });
};

exports.deleteProductComment = async (userId, productId, commentId) => {
    const uid = Number(userId);
    const pid = Number(productId);
    const cid = Number(commentId);

    if (isNaN(uid) || isNaN(pid) || isNaN(cid)) {
        const error = new Error('Invalid input');
        error.status = 400;
        throw error;
    }

    const comment = await db.productComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('Comment not found');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('Unauthorized : Not your comment');
        error.status = 403;
        throw error;
    }

    if (comment.productId !== pid) {
        const error = new Error('Unauthorized');
        error.status = 403;
        throw error;
    }

    return await db.productComment.delete({ where: { id: cid } });
};

exports.getAllArticleComments = async (articleId, query) => {
    const id = Number(articleId);
    const limit = parseInt(query.limit) || 10;
    const cursor = query.cursor ? parseInt(query.cursor) : null;

    if (!id || isNaN(id)) throw Object.assign(new Error(), { status: 404 });

    const article = await db.article.findUnique({ where: { id } });
    if (!article) throw Object.assign(new Error(), { status: 404 });

    const comments = await db.articleComment.findMany({
        where: { articleId: id },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'desc' },
        select: { id: true, content: true, createdAt: true },
    });

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
    return { comments, nextCursor };
};

exports.createArticleComment = async (userId, articleId, content) => {
    const id = Number(articleId);

    if (!content || !id || isNaN(id)) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    const article = await db.article.findUnique({ where: { id } });

    if (!article) {
        const error = new Error();
        error.status = 404;
        throw error;
    }

    return await db.articleComment.create({
        data: {
            content,
            user: { connect: { id: userId } },
            article: { connect: { id } },
        },
    });
};

exports.updateArticleComment = async (userId, articleId, commentId, content) => {
    const uid = Number(userId);
    const aid = Number(articleId);
    const cid = Number(commentId);

    if (!content || isNaN(uid) || isNaN(aid) || isNaN(cid)) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    const comment = await db.articleComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error();
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error();
        error.status = 403;
        throw error;
    }

    if (comment.articleId !== aid) {
        const error = new Error();
        error.status = 403;
        throw error;
    }

    return await db.articleComment.update({ where: { id: cid }, data: { content } });
};

exports.deleteArticleComment = async (userId, articleId, commentId) => {
    const uid = Number(userId);
    const aid = Number(articleId);
    const cid = Number(commentId);

    if (isNaN(uid) || isNaN(aid) || isNaN(cid)) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    const comment = await db.articleComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('Comment not found');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('Unauthorized : Not your comment');
        error.status = 403;
        throw error;
    }

    if (comment.articleId !== aid) {
        const error = new Error('Unauthorized');
        error.status = 403;
        throw error;
    }
    return await db.articleComment.delete({ where: { id: cid } });
};
