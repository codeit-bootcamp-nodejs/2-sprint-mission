// routes/article.js
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/araticles.dtos.js');
const { db } = require('../utils/db.js');

// GET /article
const getAllArticles = async (req, res, next) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 10;
        const keyword = req.query.keyword || '';

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

        res.status(200).json(articles);
    } catch (err) {
        return next(err);
    }
};

// GET /article/:id
const getArticleById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

         if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const { id: aid, title, content, createdAt } = article;
        res.status(200).json({ id: aid, title, content, createdAt });
    } catch (err) {
       return next(err);
    }
};

// POST /article
const createArticle = async (req, res, next) => {
    try {
        assert(req.body, CreateDto);
        const { title, content } = req.body;

        await db.article.create({ data: { title, content } });
        res.status(201).json({ message: 'Successfully registered' });
    } catch (err) {
        if (err?.name === 'StructError') return res.status(400).json({ error: err.message });
        return next(err);
    }
};

// PATCH /article/:id
const updateArticle = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

         if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const { title, content } = req.body;
        const updated = await db.article.update({ where: { id }, data: { title, content } });
        res.status(200).json({ message: 'Successfully updated', article: updated });
    } catch (err) {
       return next(err);
    }
};

// DELETE /article/:id
const deleteArticle = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

         if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        await db.article.delete({ where: { id } });
        res.status(200).json({ message: 'Successfully deleted' });
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
