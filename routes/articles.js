var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/articles.dto');
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
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    };

    const articles = await db.article.findMany({
      where,
      orderBy: sort === 'recent' ? { id: 'desc' } : undefined,
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true
      }
    });

    res.status(200).json({
      message: '게시글 목록 조회 성공',
      page: Number(page),
      pageSize: Number(pageSize),
      articles
    });
  } catch (err) {
    next(err);
  }
});

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

router.get('/:id', async (req, res, next) => {
  try {
    const article = await db.article.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true
      }
    });

    if (!article) {
      const error = new Error('게시글을 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }
    return res.status(200).json(article);
    
 } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;


    const updatedArticle = await db.article.update({
      where: { id: Number(req.params.id) },
      data: updateData
    });

    res.status(200).json({
      message: '게시글이 수정되었습니다.',
      article: updatedArticle
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await db.article.delete({
      where: { id: Number(req.params.id) }
    })
    return res.status(200).json({ message: ' 게시글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
})

module.exports = router;
