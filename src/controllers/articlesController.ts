// src/controllers/articlesController.ts
import { Request, Response } from 'express';
import { validate } from '../lib/validate';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import * as articlesService from '../services/articlesService';
import * as commentsService from '../services/commentsService';
import * as likesService from '../services/likesService';
import { assertHasUser } from "../utils/assertHasUser";

type IdParams = { id: number };
type CreateArticleBody = { title: string; content: string; image?: string | null };
type UpdateArticleBody = Partial<CreateArticleBody>;
type GetArticleListParams = { page?: number; limit?: number; cursor?: number; orderBy?: string; keyword?: string };
type CreateCommentBody = { content: string };
type GetCommentListParams = { cursor?: number; limit?: number };

export async function createArticle(req: Request, res: Response) {
  assertHasUser(req);
  const data = validate<CreateArticleBody>(req.body, CreateArticleBodyStruct);
  const article = await articlesService.createArticle({
    ...data,
    userId: req.user.id,
  });
  res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = validate<IdParams>(req.params, IdParamsStruct);
  const article = await articlesService.getArticle(id);
  res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
  assertHasUser(req);
  const { id } = validate<IdParams>(req.params, IdParamsStruct);
  const data = validate<UpdateArticleBody>(req.body, UpdateArticleBodyStruct);
  const updatedArticle = await articlesService.updateArticle(id, {
    ...data,
    userId: req.user.id,
  });
  res.send(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  assertHasUser(req);
  const { id } = validate<IdParams>(req.params, IdParamsStruct);
  await articlesService.deleteArticle(id, req.user.id);
  res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  assertHasUser(req);
  const params = validate<GetArticleListParams>(req.query, GetArticleListParamsStruct);
  const result = await articlesService.getArticleList(params as any);
  res.send(result);
}

export async function createComment(req: Request, res: Response) {
  assertHasUser(req);
  const { id: articleId } = validate<IdParams>(req.params, IdParamsStruct);
  const { content } = validate<CreateCommentBody>(req.body, CreateCommentBodyStruct);
  const createdComment = await commentsService.createComment({
    articleId,
    content,
    userId: req.user.id,
  });
  res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  assertHasUser(req);
  const { id: articleId } = validate<IdParams>(req.params, IdParamsStruct);
  const { cursor, limit } = validate<GetCommentListParams>(req.query, GetCommentListParamsStruct);
  const result = await commentsService.getCommentListByArticleId(articleId, { cursor, limit });
  res.send(result);
}

export async function createLike(req: Request, res: Response) {
  assertHasUser(req);
  const { id: articleId } = validate<IdParams>(req.params, IdParamsStruct);
  await likesService.createLike(articleId, req.user.id);
  res.status(201).send();
}

export async function deleteLike(req: Request, res: Response) {
  assertHasUser(req);
  const { id: articleId } = validate<IdParams>(req.params, IdParamsStruct);
  await likesService.deleteLike(articleId, req.user.id);
  res.status(204).send();
}
