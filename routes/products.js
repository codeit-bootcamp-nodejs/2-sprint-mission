var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dto');
const { db } = require('../utils/db');

const router = express.Router();


router.get('/list', async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      sort = 'recent'
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    };

    const products = await db.product.findMany({
      where,
      orderBy: sort === 'recent' ? { id: 'desc' } : undefined,
      skip,
      take,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true
      }
    });

    res.status(200).json({
      message: '상품 목록 조회 성공',
      page: Number(page),
      pageSize: Number(pageSize),
      products
    });
  } catch (err) {
    next(err);
  }
});


router.post('/create', async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const { name, description, price, tags } = req.body;
    const newProduct = await db.product.create({
      data: { name, description, price, tags }
    });

    return res.status(201).json({
      message: '상품이 등록되었습니다.',
      productId: newProduct.id
    });
  } catch (err) {
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const product = await db.product.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true
      }
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    return res.json(product);

  } catch (err) {
    next(err);
  }
});


router.patch('/:id', async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (tags !== undefined) updateData.tags = tags;


    const updatedProduct = await db.product.update({
      where: { id: Number(req.params.id) },
      data: updateData
    });

    res.status(200).json({
      message: '상품 정보가 수정되었습니다.',
      product: updatedProduct
    });
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    await db.product.delete({
      where: { id: Number(req.params.id) }
    })
    return res.status(200).json({ message: ' 상품이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
})




module.exports = router;
