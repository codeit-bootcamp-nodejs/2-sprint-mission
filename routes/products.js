var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dto');
const { db } = require('../utils/db');

const router = express.Router();


router.get('/list', async function (req, res, next) {
  const products = await db.product.findMany({
    orderBy: {
      id: 'asc'
    }
  });
  res.json(products);
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
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (tags !== undefined) updateData.tags = tags;


    const updatedProduct = await db.product.update({
      where: { id: Number(id) },
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



module.exports = router;
