import express from 'express';
import prisma from '../../utills/prisma.js';
import passport from '../../lib/passport/index.js';

const articleCommentRouter = express.Router();


articleCommentRouter.get('/', getArticleComments);
articleCommentRouter.post('/:articleId', 
  passport.authenticate('access-token', { session: false }), 
  createArticleComment);
articleCommentRouter.patch('/:articleId', 
  passport.authenticate('access-token', { session: false }), 
  updateArticleComment);
articleCommentRouter.delete('/:articleId', 
  passport.authenticate('access-token', { session: false }), 
  deleteArticleComment);

async function getArticleComments(req, res, next) {
  let cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
  const articleId = req.query.articleId ? req.query.articleId : undefined;
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
      articleId : articleId
    },
  };
  if (cursor) {
    findManyArgs.cursor = { id: cursor };
    findManyArgs.skip = 1;
  }
  const comments = await prisma.ArticleComment.findMany(findManyArgs);
  let message
  if(comments[2]) {
    message = `다음 커서는 ${comments[2].id}입니다.`;
  } else {
    message = '다음 커서가 없습니다.';
  }
  res.send({commnts: comments, message: message});
}

async function createArticleComment(req, res, next) {
  const Comment = await prisma.articleComment.create({
    data: {
      ...req.body,
      userId: req.user.id,
      articleId: parseInt(req.params.articleId),
    },
  });
  res.send(Comment);
}

async function updateArticleComment(req, res, next) {
  try {
    const id = parseInt(req.params.articleId);
    const comment = await prisma.articleComment.findUnique({ where: { id: id } });
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
    const updatedComment = await prisma.articleComment.update({
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

async function deleteArticleComment(req, res, next) {
  try {
    const id = parseInt(req.params.articleId);
    const comment = await prisma.articleComment.findUnique({ where: { id: id } });
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
    await prisma.articleComment.delete({
      where: { id : id },
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


export default articleCommentRouter;