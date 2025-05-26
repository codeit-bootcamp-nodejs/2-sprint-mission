// routes/product.js
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dtos.js');
const { db } = require('../utils/db.js');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 파일 업로드 설정
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: 'uploads/' });

// GET /product 
const getAllProducts = async (req, res, next) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 10;
        const keyword = req.query.keyword || '';

        const where = keyword
            ? { OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { description: { contains: keyword, mode: 'insensitive' } }] }
            : {};

        const products = await db.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: { id: true, name: true, price: true, createdAt: true },
        });

        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

// GET /product/:id 
const getProductById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });

        if (!product) return res.status(404).json({ error: 'Product not found' });

        const { id: pid, name, description, price, tags, createdAt } = product;
        res.status(200).json({ id: pid, name, description, price, tags, createdAt });
    } catch (err) {
        next(err);
    }
};

// POST /product 
const createProduct = async (req, res, next) => {
    try {
        assert(req.body, CreateDto);
        const { name, description, price, tags } = req.body;

        await db.product.create({ data: { name, description, price, tags } });
        res.status(201).json({ message: 'Successfully registered' });
    } catch (err) {
        if (err?.name === 'StructError') return res.status(400).json({ error: err.message });
        next(err);
    }
};

// PATCH /product/:id 
const updateProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const dataToUpdate = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            tags: req.body.tags,
        };

        // 파일이 올라왔을 때만 처리
        if (req.file) {
            const { originalname, filename } = req.file;
            const ext = path.extname(originalname);
            const newName = filename + ext;
            const newPath = path.join(uploadDir, newName);

            fs.renameSync(req.file.path, newPath);
            dataToUpdate.imageUrl = `/product/files/${newName}`;
        }

        const updated = await db.product.update({ where: { id }, data: dataToUpdate });
        res.status(200).json({ message: 'Successfully updated', product: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /product/:id 
const deleteProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await db.product.delete({ where: { id } });
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    upload,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
