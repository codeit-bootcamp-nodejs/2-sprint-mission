const { db } = require('../config/db');

// (상품) 댓글 전체 목록 조회
exports.getAllProductComments = async (productId, query) => {
    const id = Number(productId);
    const limit = parseInt(query.limit) || 10;
    const cursor = query.cursor ? parseInt(query.cursor) : null;

    if (!id || isNaN(id)) {
        const error = new Error('유효하지 않은 상품 ID');
        error.status = 404;
        throw error;
    }

    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
        const error = new Error('조회할 상품 없음');
        error.status = 404;
        throw error;
    }

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

// 댓글 생성
exports.createProductComment = async (productId, content, userId) => {
    const id = Number(productId);
    if (!content || !id || isNaN(id)) {
        const error = new Error('댓글 내용 또는 상품 ID가 유효하지 않음');
        error.status = 404;
        throw error;
    }

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
        const error = new Error('댓글 작성할 상품 없음');
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

// 댓글 수정
exports.updateProductComment = async (productId, commentId, content, userId) => {
    const pid = Number(productId);
    const cid = Number(commentId);
    const uid = Number(userId);

    if (!content || isNaN(pid) || isNaN(cid) || isNaN(uid)) {
        const error = new Error('요청 정보 유효하지 않음');
        error.status = 400;
        throw error;
    }

    const comment = await db.productComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('수정할 댓글 없음');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('작성자만 수정 가능');
        error.status = 403;
        throw error;
    }

    if (comment.productId !== pid) {
        const error = new Error('해당 상품에 작성된 댓글 아님');
        error.status = 403;
        throw error;
    }

    return await db.productComment.update({ where: { id: cid }, data: { content } });
};

// 댓글 삭제
exports.deleteProductComment = async (userId, productId, commentId) => {
    const uid = Number(userId);
    const pid = Number(productId);
    const cid = Number(commentId);

    if (isNaN(uid) || isNaN(pid) || isNaN(cid)) {
        const error = new Error('유효하지 않은 요청');
        error.status = 400;
        throw error;
    }

    const comment = await db.productComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('삭제할 댓글 없음');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('작성자만 삭제 가능');
        error.status = 403;
        throw error;
    }

    if (comment.productId !== pid) {
        const error = new Error('해당 상품에 작성된 댓글 아님');
        error.status = 403;
        throw error;
    }

    return await db.productComment.delete({ where: { id: cid } });
};

// (게시글) 댓글 전체 목록 조회
exports.getAllArticleComments = async (articleId, query) => {
    const id = Number(articleId);
    const limit = parseInt(query.limit) || 10;
    const cursor = query.cursor ? parseInt(query.cursor) : null;

    if (!id || isNaN(id)) {
        const error = new Error('유효하지 않은 게시글 ID');
        error.status = 404;
        throw error;
    }

    const article = await db.article.findUnique({ where: { id } });

    if (!article) {
        const error = new Error('해당 게시글 없음');
        error.status = 404;
        throw error;
    }

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

// 댓글 생성
exports.createArticleComment = async (userId, articleId, content) => {
    const id = Number(articleId);

    if (!content || !id || isNaN(id)) {
        const error = new Error('댓글 또는 게시글 ID가 유효하지 않음');
        error.status = 400;
        throw error;
    }

    const article = await db.article.findUnique({ where: { id } });

    if (!article) {
        const error = new Error('댓글 작성할 게시글 없음');
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

// 댓글 수정
exports.updateArticleComment = async (userId, articleId, commentId, content) => {
    const uid = Number(userId);
    const aid = Number(articleId);
    const cid = Number(commentId);

    if (!content || isNaN(uid) || isNaN(aid) || isNaN(cid)) {
        const error = new Error('요청 정보 유효하지 않음');
        error.status = 400;
        throw error;
    }

    const comment = await db.articleComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('수정할 댓글 없음');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('작성자만 댓글 수정 가능');
        error.status = 403;
        throw error;
    }

    if (comment.articleId !== aid) {
        const error = new Error('해당 게시글에 작성된 댓글 아님');
        error.status = 403;
        throw error;
    }

    return await db.articleComment.update({ where: { id: cid }, data: { content } });
};

// 댓글 삭제
exports.deleteArticleComment = async (userId, articleId, commentId) => {
    const uid = Number(userId);
    const aid = Number(articleId);
    const cid = Number(commentId);

    if (isNaN(uid) || isNaN(aid) || isNaN(cid)) {
        const error = new Error('유효하지 않은 요청');
        error.status = 400;
        throw error;
    }

    const comment = await db.articleComment.findUnique({ where: { id: cid } });

    if (!comment) {
        const error = new Error('삭제할 댓글 없음');
        error.status = 404;
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('작성자만 삭제 가능');
        error.status = 403;
        throw error;
    }

    if (comment.articleId !== aid) {
        const error = new Error('해당 게시글에 작성된 댓글 아님');
        error.status = 403;
        throw error;
    }
    return await db.articleComment.delete({ where: { id: cid } });
};
