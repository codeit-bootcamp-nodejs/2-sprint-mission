import express from 'express';
import prisma from '../../utills/prisma.js';
import passport from '../../lib/passport/index.js';

const articleLikedRouter = express.Router();

articleLikedRouter.get('/',
  passport.authenticate('access-token', { session: false }),
  getArticleLiked);
articleLikedRouter.post('/:articleId', 
  passport.authenticate('access-token', { session: false }), 
  createArticleLiked);
articleLikedRouter.delete('/:articleId', 
  passport.authenticate('access-token', { session: false }), 
  deleteArticleLiked);

async function getArticleLiked(req, res, next) {
  try {
    const articleLiked = await prisma.articleLiked.findMany({
      where: {
        userId: parseInt(req.user.id),
      },
    });
    res.send(articleLiked);
  } catch(err) {
    next(err);
  } 
}
  
async function createArticleLiked(req, res, next) {
  try {
    const articleLiked = await prisma.articleLiked.findUnique({
      where: {
        userId_articleId: {
          userId: parseInt(req.user.id),
          articleId: parseInt(req.params.articleId),
        },
      },
    });
    if (articleLiked) {
      return next(new Error('이미 좋아요를 눌렀습니다.'));
    }
    await prisma.articleLiked.create({
      data: {
        userId: parseInt(req.user.id),
        articleId: parseInt(req.params.articleId),
      },
    });
    res.send({ message: '좋아요를 눌렀습니다.' });
  } catch(err) {
    next(err);
  }
}

async function deleteArticleLiked(req, res, next) {
  try {
    const articleLiked = await prisma.articleLiked.findUnique({
      where: {
        userId_articleId: {
          userId: parseInt(req.user.id),
          articleId: parseInt(req.params.articleId),
        },
      },
    });
    if (!articleLiked) {
      return next(new Error('좋아요를 찾을 수 없습니다.'));
    }
    await prisma.articleLiked.delete({
      where: {
        userId_articleId: {
          userId: parseInt(req.user.id),
          articleId: parseInt(req.params.articleId),
        },
      },
    });
    res.send({ message: '좋아요를 취소했습니다.' });
  } catch(err) {
    next(err);
  }
}

export default articleLikedRouter;