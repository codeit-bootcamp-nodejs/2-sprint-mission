// routes/article.js
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/araticles.dtos.js');
const { db } = require('../utils/db.js');

// GET /article : 게시글 목록 검색하고 페이징 처리하여 응답 반환
const getAllArticles = async (req, res, next) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 10;
        const keyword = req.query.keyword || '';

        // 05.29
        if (skip < 0 || limit < 0 || isNaN(skip) || isNaN(limit)) {
            const error = new Error();
            error.status = 400;
            return next(error);
        }

        const where = keyword ? { OR: [{ title: { contains: keyword, mode: 'insensitive' } }, { content: { contains: keyword, mode: 'insensitive' } }] } : {};

        const articles = await db.article.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: { id: true, title: true, content: true, createdAt: true },
        });

        return res.status(200).json(articles);
    } catch (err) {
        return next(err);
    }
};

// GET /article/:id  : Id로 특정 게시글글 조회
const getArticleById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

        // 05.29
        if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const { id: aid, title, content, createdAt } = article;
        return res.status(200).json({ id: aid, title, content, createdAt });
    } catch (err) {
        return next(err);
    }
};

// POST /article : 게시글 등록
const createArticle = async (req, res, next) => {
    try {
        assert(req.body, CreateDto);
        const { title, content } = req.body;

        await db.article.create({ data: { title, content } });
        return res.status(201).json({ message: 'Successfully registered' });
    } catch (err) {
        if (err?.name === 'StructError') return res.status(400).json({ error: err.message });
        return next(err);
    }
};

// PATCH /article/:id : 게시글 수정
const updateArticle = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

        // 05.29
        if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        // req.body에 입력받은 데이터를 구조분해 할당으로 title, content에 저장
        const { title, content } = req.body;
        const updated = await db.article.update({ where: { id }, data: { title, content } });
        return res.status(200).json({ message: 'Successfully updated', article: updated });
    } catch (err) {
        return next(err);
    }
};

// DELETE /article/:id  : 게시글 삭제
const deleteArticle = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

        // 05.29
        if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        await db.article.delete({ where: { id } });
        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
};
