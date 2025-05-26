var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dto');
const { db } = require('../utils/db');

const router = express.Router();


router.get('/list', async function(req, res, next) {
  const products = await db.product.findMany();
  res.json(products);
});

router.post('/create', async (req, res, next) => {
  try{
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

module.exports = router;
