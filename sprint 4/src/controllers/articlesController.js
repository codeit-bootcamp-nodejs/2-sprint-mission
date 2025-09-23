import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

// 게시글 등록 (userId 저장)
export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);
  const userId = req.user.userId;
  const article = await prismaClient.article.create({
    data: { ...data, userId },
  });
  return res.status(201).send(article);
}

// 게시글 상세 조회
export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }
  return res.send(article);
}

// 게시글 수정 (본인만 가능)
export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }
  // ★ 인가(권한) 체크
  if (existingArticle.userId !== req.user.userId) {
    return res.status(403).json({ message: '수정 권한이 없습니다.' });
  }

  const updatedArticle = await prismaClient.article.update({ where: { id }, data });
  return res.send(updatedArticle);
}

// 게시글 삭제 (본인만 가능)
export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }
  // ★ 인가(권한) 체크
  if (existingArticle.userId !== req.user.userId) {
    return res.status(403).json({ message: '삭제 권한이 없습니다.' });
  }

  await prismaClient.article.delete({ where: { id } });
  return res.status(204).send();
}

// 게시글 목록
export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}

// 게시글 댓글 등록 (userId 저장)
export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const userId = req.user.userId;
  const comment = await prismaClient.comment.create({
    data: { articleId, content, userId },
  });

  return res.status(201).send(comment);
}

// 게시글 댓글 목록
export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}
