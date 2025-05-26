const express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dtos.js');
const { db } = require('../utils/db.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// multer 기본 설정
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// dest 경로 지정
const upload = multer({ dest: 'uploads/' });

// GET ALL
router.get('/', async (req, res, next) => {
    try {
        const skip = Number(req.query.skip);
        const limit = Number(req.query.limit);
        const keyword = req.query.keyword;
        console.log(keyword);

        // 조건
        const where = keyword
            ? {
                  OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { description: { contains: keyword, mode: 'insensitive' } }],
              }
            : {};

        const products = await db.product.findMany({
            where,
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
            const error = new Error('Product not found');
            error.status = 404;
            return next(error);
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

router.patch('/:id', upload.single('file'), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });
        if (!product) {
            const error = new Error('Product not found');
            error.status = 404;
            return next(error);
        }

        // const { name, description, price, tags } = req.body;
        const dataToUpdate = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            tags: req.body.tags,
        };

        if (req.file) {
            const { originalname, filename } = req.file;
            const extension = path.extname(originalname);
            const newFileName = filename + extension;
            const newPath = path.join(uploadDir, newFileName);

            fs.renameSync(req.file.path, newPath);

            dataToUpdate.imageUrl = `/product/files/${newFileName}`;
        }

        const updated = await db.product.update({ where: { id }, data: dataToUpdate });
        return res.status(200).json({ message: 'Successfully updated', product: updated });
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });

        if (!product) {
            const error = new Error('Product not found');
            error.status = 404;
            return next(error);
        }

        await db.product.delete({ where: { id: Number(req.params.id) } });
        return res.status(200).json({ message: 'Succefully deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
