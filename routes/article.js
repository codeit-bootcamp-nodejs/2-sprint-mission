const express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/araticles.dtos.js');
const { db } = require('../utils/db.js');
const router = express.Router();

// GET ALL
router.get('/', async (req, res, next) => {
    try {
        const skip = Number(req.query.skip);
        const limit = Number(req.query.limit);
        const keyword = req.query.keyword;
        console.log(keyword);

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
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        return res.status(200).json(articles);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const article = await db.article.findUnique({ where: { id: Number(req.params.id) } });
        if (!article) {
            return res.status(400).json({ error: 'Article not found' });
        } else {
            const { id, title, content, createdAt } = article;
            return res.status(200).json({ id, title, content, createdAt });
        }
    } catch (err) {
        next(err);
    }
});

// POST
router.post('/', async (req, res, next) => {
    try {
        assert(req.body, CreateDto);
        const { title, content } = req.body;

        await db.article.create({
            data: { title, content },
        });

        return res.status(201).json({ message: 'Successfully registered' });
    } catch (err) {
        if (err?.name === 'StructError') {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
});

// PATCH
router.patch('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const article = await db.article.findUnique({ where: { id } });

        if (!article) {
            return res.status(400).json({ error: 'Article not found' });
        }
        const { title, content } = req.body;
        const updateArticle = await db.article.update({
            where: { id },
            data: { title, content },
        });
        return res.status(200).json({ message: 'Successfully updated', article: updateArticle });
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const article = await db.article.findUnique({ where: { id } });

    if (!article) {
        return res.status(400).json({ error: 'Article not found' });
    }

    try {
        await db.article.delete({ where: { id: Number(req.params.id) } });
        return res.status(200).json({ message: 'Succefully deleted' });
    } catch (err) {
        res.status(500).json({ err: 'Failed to delete' });
    }
});

module.exports = router;
