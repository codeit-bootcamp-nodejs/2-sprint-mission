var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/comments.dto');
const { db } = require('../utils/db');

const router = express.Router();


router.get('/:productId/list', async (req, res, next) => {
  try {
    const {
     cursor,
     limit = 9
    } = req.query;


    const comments = await db.productComment.findMany({
      where: { productId: req.params.productid},
      skip: cursor ? 1 : 0, 
      cursor: cursor ? { id: Number(cursor) } : undefined,
      take: Number(limit),
      orderBy: { id: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true
      }
    });

    const nextCursor = comments.length === Number(limit)
      ? comments[comments.length - 1].id
      : null;

    res.status(200).json({
      message: '댓글 목록 조회 성공',
      comments,
      nextCursor
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:productId/comments', async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const newComment = await db.productComment.create({
      data: {
        content: req.body.content,
        product: { connect: { id: Number(req.params.productId) } }
      }
    });

    res.status(201).json({
      message: '댓글이 등록되었습니다.',
      commentid: newComment.id
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/:commentId', async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const updateComment = await db.productComment.update({
      where: {id: Number(req.params.commentId) },
      data: { content: req.body.content }
    });
    res.status(200).json({
      massage: '댓글이 수정되었습니다.'
    })
   
    
  } catch (err) {
    next(err);
  }
});

router.delete('/:commentId', async (req, res, next) => {
  try {
    const deleteComment = await db.productComment.delete({
      where: { id: Number(req.params.commentId) }
    });
    res.status(200).json({
      massage: '댓글이 삭제되었습니다.'
    })
  } catch {
    next(err);
  }
});

module.exports = router;
