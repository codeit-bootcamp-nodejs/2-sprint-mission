import express from 'express';
import { assert } from 'superstruct';
import prisma from '../../utills/prisma';
import { Article } from '@prisma/client';
import { 
  CreateArticle,
  PatchArticle 
} from '../../utills/structs';
import ArticleRepository from '../../repository/article/article-repository';

class ArticleService {

  static getArticles: express.RequestHandler = async (req, res, next) => {
    const { offset = 0, limit = 10, sort = 'recent', search = ''} = req.query as {
      offset: string | number;
      limit: string | number;
      sort: string;
      search: string;
    };
    let orderBy: { createdAt: 'asc' | 'desc' };
    switch(sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'former':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    const articles = await ArticleRepository.getArticlelist(Number(offset), Number(limit), orderBy, search);
    if (articles instanceof Error) {
        return next(articles);
    }
    if (articles.length === 0) {
        res.send({ message : `${search}로 검색된 게시글이 없습니다. (offset: ${offset})`});
        return;
    }
    const response = articles.map((article) => {
      let isLiked = false;
      if (req.user) {
        isLiked = article.articleLiked?.some((liked) => liked.userId === req.user?.id) ?? false;
      }
      const { articleLiked, ...rest } = article;
      const articlsData: Article & { isLiked: boolean } = {
        ...rest,
        isLiked: isLiked
      };
      return articlsData;
    });
    res.send(response);
  }

  static createArticle: express.RequestHandler = async (req, res, next) => {
    try {
      assert(req.body, CreateArticle);
      const article = await ArticleRepository.createArticle({
        ...req.body,
        user: {
          connect: { id: req.user!.id }
        }
      });
      res.send(article);
    } catch (err) {
        return next(err);
    }
  }

  static getArticleById: express.RequestHandler = async (req, res, next) => {
    const articleId = Number(req.params.articleId);
    const article = await ArticleRepository.getArticleByIdOrThrow(articleId);
    let isLiked = false;
    if (req.user) {
      isLiked = article.articleLiked?.some((liked) => liked.userId === req.user?.id) ?? false;
    }
    const { articleLiked, ...rest } = article;
    const response = {
      ...rest,
      isLiked: isLiked,
    }
    res.send(response);
  }

  static updateArticle: express.RequestHandler = async (req, res, next) => {
    try {
      assert(req.body, PatchArticle);
      const articleId = Number(req.params.articleId);
      const article = await ArticleRepository.getArticleByIdOrThrow(articleId);
      if (article.userId !== req.user?.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 403;
        return next(err as Error);
      }
      const updatedArticle = await ArticleRepository.updateArticle(articleId, req.body);
      res.send(updatedArticle);
    } catch (err) {
      return next(err as Error);
    }
  }

  static deleteArticle: express.RequestHandler  = async (req, res, next) => {
    try {
    const articleId = Number(req.params.articleId);
    const article = await ArticleRepository.getArticleByIdOrThrow(articleId);
    if (article.userId !== req.user!.id) {
      const err = new Error('인증되지 않은 사용자입니다.');
      err.status = 403;
      return next(err);
    }
    await ArticleRepository.deleteArticle(articleId);
    res.sendStatus(204);
    } catch (err) {
      return next(err as Error);
    }
  }
}

export default ArticleService;