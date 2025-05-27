const express = require('express');
const { db } = require('../utils/db.js');
const router = express.Router();

// 🚩 Product Comment
// Get
// baseurl/product/:productId/comment?skip=0&take=5
const getAllProductComments = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

        const comments = await db.productComment.findMany({
            where: { productId },
            take: limit,
            skip: cursor ? 1 : 0, // 커서가 있을 땐 1개 건너뛰기
            cursor: cursor ? { id: cursor } : undefined, // 커서 지정
            orderBy: { id: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
        };

        // 마지막 아이템 id
        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

        // const exists = await db.productComment.findUnique({ where: { id: 3 } });
        // console.log(exists);

        return res.status(200).json({ comments, nextCursor });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// POST
const createProductComment = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);
        const { content } = req.body;

        if (!content || isNaN(productId)) {
            const error = new Error('Invalid input');
            error.status = 404;
            return next(error);
        }

        const newComment = await db.productComment.create({
            data: {
                content,
                product: {
                    connect: { id: productId },
                },
            },
        });
        return res.status(201).json({ message: 'Successfully registered', comment: newComment });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// PATCH
const updateProductComment = async (req, res, next) => {
    /*
    1. 댓글 ID로 댓글 찾아서 수정
    2. 수정할 content 유효한지 확인 
    3. productId가 해당 댓글과 연결 되어있는지 확인
    4. 댓글 없으면 404에러 처리
    */
    try {
        const productId = Number(req.params.productId);
        const commentId = Number(req.params.commentId);
        const { content } = req.body;

        if (!content || isNaN(productId) || isNaN(commentId)) {
            const error = new Error('Invalid input');
            error.status = 404;
            return next(error);
        }

        const existingComment = await db.productComment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            const error = new Error('Comment not found');
            error.status = 404;
            return next(error);
        }

        if (existingComment.productId !== productId) {
            const error = new Error('Comment does not beling to the specified product');
            error.status = 404;
            return next(error);
        }

        const updatedComment = await db.productComment.update({
            where: { id: commentId },
            data: { content },
        });

        return res.status(200).json({ message: 'Comment updated', comment: updatedComment });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// DELETE
const deleteProductComment = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);
        const commentId = Number(req.params.commentId);

        if (isNaN(productId) || isNaN(commentId)) {
            const error = new Error('Invalid productId or commentId');
            error.status = 404;
            return next(error);
        }

        const comment = await db.productComment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            const error = new Error('Comment not found');
            error.status = 404;
            return next(error);
        }

        if (comment.productId !== productId) {
            const error = new Error('Comment does not belong to the specified product');
            error.status = 404;
            return next(error);
        }

        await db.productComment.delete({ where: { id: commentId } });
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 🚩 Article Comment
// Get ALL
const getAllArticleComments = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

        const comments = await db.articleComment.findMany({
            where: { articleId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
        });

        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

        return res.status(200).json({ comments, nextCursor });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// POST
const createArticleComment = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const { content } = req.body;

        if (!content || isNaN(articleId)) {
            const error = new Error('Invalid input');
            error.status = 404;
            return next(error);
        }

        const newComment = await db.articleComment.create({
            data: {
                content,
                article: {
                    connect: { id: articleId },
                },
            },
        });
        return res.status(201).json({ message: 'Successfully registered', comment: newComment });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// PATCH
const updateArticleComment= async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const commentId = Number(req.params.commentId);
        const { content } = req.body;

        if (!content || isNaN(articleId) || isNaN(commentId)) {
            const error = new Error('Invalid input');
            error.status = 404;
            return next(error);
        }

        const existingComment = await db.articleComment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            const error = new Error('Comment not found');
            error.status = 404;
            return next(error);
        }

        if (existingComment.articleId !== articleId) {
            const error = new Error('Comment does not beling to the specified article');
            error.status = 404;
            return next(error);
        }

        const updatedComment = await db.articleComment.update({
            where: { id: commentId },
            data: { content },
        });

        return res.status(200).json({ message: 'Comment updated', comment: updatedComment });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// DELETE
const deleteArticleComment = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const commentId = Number(req.params.commentId);

        if (isNaN(articleId) || isNaN(commentId)) {
            const error = new Error('Invalid articleId or commentId');
            error.status = 404;
            return next(error);
        }

        const comment = await db.articleComment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            const error = new Error('Comment not found');
            error.status = 404;
            return next(error);
        }

        if (comment.articleId !== articleId) {
            const error = new Error('Comment does not belong to the specified article');
            error.status = 404;
            return next(error);
        }

        await db.articleComment.delete({ where: { id: commentId } });
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = {
    getAllProductComments,
    getAllArticleComments,
    createProductComment,
    createArticleComment,
    updateProductComment,
    updateArticleComment,
    deleteProductComment,
    deleteArticleComment
}
