import express from 'express';
import { assert, StructError } from 'superstruct';
import { PrismaClient } from '@prisma/client';
import { 
  CreateArticle,
  PatchArticle 
} from '../structs.js';

const prisma = new PrismaClient();
const articleRouter = express.Router();

articleRouter.route('')
  .get(async (req, res, next) => {
    const { offset = 0, limit = 10, sort = 'recent', search = ''} = req.query;
    let orderBy;
    switch(sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'former':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc'};
    }
    const article = await prisma.article.findMany({
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' }},
          { content: { contains: search, mode: 'insensitive' }},
        ],
      },
      select: {
      id: true,
      title: true,   
      content: true,
      createdAt: true,
      updatedAt: false,
      },
    });
    if (article.length === 0) {
        return res.send({ message : `${search}로 검색된 게시글이 없습니다. (offset: ${offset})`});
    }
    res.send(article);
  })
  .post(async (req, res, next) => {
    try {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.send(article);
    } catch (err) {
        if (err instanceof StructError) {
          console.log('****************************StructError 발생!****************************');
          return next(err);
        }
        next(err);
    }
  });

articleRouter.route('/:id')
  .get(async (req, res, next) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
      id: true,     
      title: true,   
      content: true,
      createdAt: true,
      updatedAt: false,
      },
    });
    if (!article) {
      const err = new Error('ID를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    res.send(article);
  })
  .patch(async (req, res, next) =>{
    try {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
        if (!article) {
          const err = new Error('ID를 찾을 수 없습니다.');
          err.status = 404;
          return next(err);
        }
      res.send(article);
    } catch (err) {
      if (err instanceof StructError) {
        console.log('****************************StructError 발생!****************************');
        return next(err);
      }
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    } catch (err) {
      if (err.code === 'P2025') { // Prisma의 RecordNotFound 에러
        const error = new Error('ID를 찾을 수 없습니다.');
        error.status = 404;
        return next(error);
      }
      next()
    }
  });


export default articleRouter;