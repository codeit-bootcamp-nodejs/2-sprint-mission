const express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dtos.js');
const { db } = require('../utils/db.js');
const router = express.Router();

// GET ALL
router.get('/', async (req, res, next) => {
    try {
        // 쿼리 파라미터 파싱
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const keyword = req.query.q?.toString() || '';

        const products = await db.product.findMany({
            where: {
                OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { description: { contains: keyword, mode: 'insensitive' } }],
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                price: true,
                createdAt: true,
            },
        });
        return res.status(200).json(products);
    } catch (err) {
        next(err);
    }
});

// GET /:id
router.get('/:id', async (req, res, next) => {
    try {
        const product = await db.product.findUnique({ where: { id: Number(req.params.id) } });
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        } else {
            const { id, name, description, price, tags, createdAt } = product;
            return res.status(200).json({ id, name, description, price, tags, createdAt });
        }
    } catch (err) {
        next(err);
    }
});

// POST
router.post('/', async (req, res, next) => {
    try {
        assert(req.body, CreateDto);
        const { name, description, price, tags } = req.body;

        await db.product.create({
            data: { name, description, price, tags },
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
        const product = await db.product.findUnique({ where: { id } });

        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }
        const { name, description, price, tags } = req.body;
        const updateProduct = await db.product.update({
            where: { id },
            data: { name, description, price, tags },
        });
        return res.status(203).json({ message: 'Successfully updated', product: updateProduct });
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
        return res.status(400).json({ error: 'Product not found' });
    }

    try {
        await db.product.delete({ where: { id: Number(req.params.id) } });
        return res.status(200).json({ message: 'Succefully deleted' });
    } catch (err) {
        res.status(500).json({ err: 'Failed to delete file' });
    }
});

module.exports = router;
