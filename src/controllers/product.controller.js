const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 등록
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), tags },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 목록 (검색 + 최신순 + offset 페이지네이션)
exports.getProductList = async (req, res, next) => {
  try {
    const { search = '', offset = 0, limit = 10 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true, name: true, price: true, createdAt: true
      }
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// 특정 ID의 상품 조회
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });
        if (!product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// 상품 정보 수정
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, tags } = req.body;
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, description, price: parseFloat(price), tags }
        });
        res.json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); // No Content
    } catch (err) {
        next(err);
    }
};