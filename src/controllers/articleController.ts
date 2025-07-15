// src/controllers/articlesController.ts
import { Request, Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import * as articleService from '../service/article.service';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articleStructs';

// 게시글 생성
export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await prismaClient.article.create({ data });
  return res.status(201).send(article);
}

// 게시글 단건 조회
export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as { id: number };
  const result = await articleService.getArticle(id);
  return res.send(result);
}

// 게시글 수정
export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const result = await articleService.updateArticle(id, data);
  return res.send(result);
}

// 게시글 삭제
export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id);
  return res.status(204).send();
}

// 게시글 목록 조회
type ArticleListQuery = {
  page: number;
  pageSize: number;
  orderBy?: string;
  keyword?: string;
};

export const listArticle = async ({
  page,
  pageSize,
  orderBy,
  keyword,
}: ArticleListQuery) => {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await articleRepository.count(where);
  const articles = await articleRepository.findAll({ page, pageSize, orderBy, where });

  return {
    list: articles,
    totalCount,
  };
};
