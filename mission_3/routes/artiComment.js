import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const artiCommentRouter = express.Router();

  artiCommentRouter.get('/all', async (req, res, next) => {
  const comments = await prisma.ArtiComment.findMany({
    select: {
    id: true, 
    articleId: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    },
  });
  res.send(comments);
});


artiCommentRouter.route('')
  .get(async (req, res, next) => {
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
    const comments = await prisma.ArtiComment.findMany(findManyArgs);
    let message
    if(comments[2]) {
      message = `다음 커서는 ${comments[2].id}입니다.`;
    } else {
      message = '다음 커서가 없습니다.';
    }
    res.send({commnts: comments, message: message});
  })
  .post(async (req, res, next) => {
    const Comment = await prisma.ArtiComment.create({
      data: req.body,
    });
    res.send(Comment);
  });

artiCommentRouter.route('/:id')
  .patch(async (req, res, next) =>{
    try {
      const { id } = req.params;
      const commnt = await prisma.ArtiComment.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      if (!commnt) {
        const err = new Error('ID를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      res.send(commnt);
    } catch (err) {
      if (err.code === 'P2025') {
        const error = new Error('ID not found');
        error.status = 404;
        return next(error);
      }
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.ArtiComment.delete({
        where: { id : parseInt(id) },
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
  });


export default artiCommentRouter;