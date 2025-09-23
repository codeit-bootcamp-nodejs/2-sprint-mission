import express from 'express';
import prisma from '../../utills/prisma.js';
import passport from '../../lib/passport/index.js';

const productLikedRouter = express.Router();

productLikedRouter.get('/',
  passport.authenticate('access-token', { session: false }),
  getProductLiked);
productLikedRouter.post('/:productId', 
  passport.authenticate('access-token', { session: false }), 
  createProductLiked);
productLikedRouter.delete('/:productId', 
  passport.authenticate('access-token', { session: false }), 
  deleteProductLiked);

async function getProductLiked(req, res, next) {
  try {
    const productLiked = await prisma.productLiked.findMany({
      where: {
        userId: parseInt(req.user.id),
      },
    });
    res.send(productLiked);
  } catch(err) {
    next(err);
  } 
}

async function createProductLiked(req, res, next) {
  try {
    const productLiked = await prisma.productLiked.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(req.user.id),
          productId: parseInt(req.params.productId),
        },
      },
    });
    if (productLiked) {
      return next(new Error('이미 좋아요를 눌렀습니다.'));
    }
    await prisma.productLiked.create({
      data: {
        userId: parseInt(req.user.id),
        productId: parseInt(req.params.productId),
      },
    });
    res.send({ message: '좋아요를 눌렀습니다.' });
  } catch (err) {
    next(err);
  }
}

async function deleteProductLiked(req, res, next) {
  try {
    const productLiked = await prisma.productLiked.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(req.user.id),
          productId: parseInt(req.params.productId),
        },
      },
    });
    if (!productLiked) {
      return next(new Error('좋아요를 찾을 수 없습니다.'));
    }
    await prisma.productLiked.delete({
      where: {
        userId_productId: {
          userId: parseInt(req.user.id),
          productId: parseInt(req.params.productId),
        },
      },
    });
    res.send({ message: '좋아요를 취소했습니다.' });
  } catch (err) {
    next(err);
  }
}

export default productLikedRouter;