import express from 'express';
import prisma from '../../utills/prisma.js';
import passport from '../../lib/passport/index.js';

const productCommentRouter = express.Router();

productCommentRouter.get('/', getProductComments);
productCommentRouter.post('/:productId', 
  passport.authenticate('access-token', { session: false }), 
  createProductComment);
productCommentRouter.patch('/:productId', 
  passport.authenticate('access-token', { session: false }), 
  updateProductComment);
productCommentRouter.delete('/:productId', 
  passport.authenticate('access-token', { session: false }), 
  deleteProductComment);


async function getProductComments(req, res, next) {
  let cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
  const productId = req.query.productId ? req.query.productId : undefined;
  const findManyArgs = {
    take: 3,
    orderBy: {
      createdAt: 'asc'
    },
    select: {
      id: true, 
      content: true,
      createdAt: true,
    },
    where: {
      productId : productId
    },
  };
  if (cursor) {
    findManyArgs.cursor = { id: cursor };
    findManyArgs.skip = 1;
  }
  const comments = await prisma.productComment.findMany(findManyArgs);
  let message
  if(comments[2]) {
    message = `다음 커서는 ${comments[2].id}입니다.`;
  } else {
    message = '다음 커서가 없습니다.';
  }
  res.send({commnts: comments, message: message});
}

async function createProductComment(req, res, next) {
  const commnt = await prisma.productComment.create({
    data: {
      ...req.body,
      userId: req.user.id,
      productId:  parseInt(req.params.productId),
    }
  });
  res.send(commnt);
}

async function updateProductComment(req, res, next) {
  try {
    const id = parseInt(req.params.productId);
    const comment = await prisma.productComment.findUnique({ where: { id: parseInt(id) } });
    if (!comment) {
      const err = new Error('comment를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    if (comment.userId !== req.user.id) {
      const err = new Error('인증되지 않은 사용자입니다.');
      err.status = 401;
      return next(err);
    }
    const updatedComment = await prisma.productComment.update({
      where: { id: id },
      data: req.body,
    });
    res.send(updatedComment);
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new Error('ID not found');
      error.status = 404;
      return next(error);
    }
    next(err);
  }
}

async function deleteProductComment(req, res, next) {
  try {
    const id = parseInt(req.params.productId);
    const comment = await prisma.productComment.findUnique({ where: { id: id } });
    if (!comment) {
      const err = new Error('comment를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    if (comment.userId !== req.user.id) {
      const err = new Error('인증되지 않은 사용자입니다.');
      err.status = 401;
      return next(err);
    }
    await prisma.productComment.delete({
      where: { id: id },
    });
    res.sendStatus(204);
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new Error('ID not found');
      error.status = 404;
      return next(error);
    }
    next(err);
  }
}

export default productCommentRouter;