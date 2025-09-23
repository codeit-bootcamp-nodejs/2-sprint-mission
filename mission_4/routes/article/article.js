import express from 'express';
import { assert, StructError } from 'superstruct';
import prisma from '../../utills/prisma.js';
import { 
  CreateArticle,
  PatchArticle 
} from '../../structs.js';
import passport from '../../lib/passport/index.js';
import { optionalAuth } from '../../utills/auth.js';

const articleRouter = express.Router();

articleRouter.get('/', optionalAuth, getArticles);
articleRouter.get('/:id', optionalAuth, getArticleById);
articleRouter.post('/',
  passport.authenticate('access-token', { session: false }), 
  createArticle);
articleRouter.patch('/:id', 
  passport.authenticate('access-token', { session: false }), 
  updateArticle);
articleRouter.delete('/:id', 
  passport.authenticate('access-token', { session: false }), 
  deleteArticle);

async function getArticles(req, res, next) {
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
    articleLiked: true,
    },
  });
  if (article.length === 0) {
      return res.send({ message : `${search}로 검색된 게시글이 없습니다. (offset: ${offset})`});
  }
  const response = article.map((article) => {
    let isLiked = false;
    if (req.user) {
      isLiked = article.articleLiked.some((liked) => liked.userId === req.user.id);
    }
    const articleData = {
      ...article,
      isLiked: isLiked
    };
    delete articleData.articleLiked;
    return articleData;
  });
  res.send(response);
}

async function createArticle(req, res, next) {
  try {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: {
        ...req.body,
        userId: req.user.id
      },
    });
    res.send(article);
  } catch (err) {
      return next(err);
  }
}

async function getArticleById(req, res, next) {
  const id = parseInt(req.params.id);
  const article = await prisma.article.findUnique({
    where: { id: id },
    select: {
    id: true,     
    title: true,   
    content: true,
    createdAt: true,
    updatedAt: false,
    articleLiked: true,
    },
  });
  if (!article) {
    const err = new Error('article을 찾을 수 없습니다.');
    err.status = 404;
    return next(err);
  }
  let isLiked = false;
  if (req.user) {
    isLiked = article.articleLiked.some((liked) => liked.userId === req.user.id);
  }
  const response = {
    ...article,
    isLiked: isLiked,
  }
  delete response.articleLiked;
  res.send(response);
}

async function updateArticle(req, res, next) {
  try {
    assert(req.body, PatchArticle);
    const id = parseInt(req.params.id);
    const article = await prisma.article.findUnique({ where: { id: id } });
    if (!article) {
      const err = new Error('article을 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    if (article.userId !== req.user.id) {
      const err = new Error('인증되지 않은 사용자입니다.');
      err.status = 401;
      return next(err);
    }
    const updatedArticle = await prisma.article.update({
      where: { id: id },
      data: req.body,
    });
    res.send(updatedArticle);
  } catch (err) {
    return next(err);
  }
}

async function deleteArticle(req, res, next) {
  try {
  const id = parseInt(req.params.id);
  const article = await prisma.article.findUnique({ where: { id: id } });
  if (!article) {
    const err = new Error('article을 찾을 수 없습니다.');
    err.status = 404;
    return next(err);
  }
  if (article.userId !== req.user.id) {
    const err = new Error('인증되지 않은 사용자입니다.');
    err.status = 401;
    return next(err);
  }
  await prisma.article.delete({
    where: { id },
  });
    res.sendStatus(204);
  } catch (err) {
    if (err.code === 'P2025') { // Prisma의 RecordNotFound 에러
      const error = new Error('article을 찾을 수 없습니다.');
      error.status = 404;
      return next(error);
    }
    next()
  }
}


export default articleRouter;