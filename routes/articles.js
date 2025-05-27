var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/articles.dto');
const { db } = require('../utils/db');

const router = express.Router();


router.post('/create', async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const { title, content } = req.body;
    const newProduct = await db.article.create({
      data: { title, content }
    });

    return res.status(200).json({
      message: '게시글이 등록되었습니다.',
      productId: newProduct.id
    })
  } catch (err) {
    next(err);
  }
});



module.exports = router;
