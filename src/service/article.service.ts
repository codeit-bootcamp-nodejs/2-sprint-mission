// src/services/article.service.ts
import { articleRepository } from '../repositories/article.repository';
import NotFoundError from '../lib/errors/NotFoundError';

interface ArticleData {
  title: string;
  content: string;
  imageUrl?: string;
}

interface ArticleListQuery {
  page: number;
  pageSize: number;
  orderBy?: string;
  keyword?: string;
}

// 게시글 단건 조회
export const getArticle = async (id: number) => {
  const article = await articleRepository.findById(id);
  if (!article) throw new NotFoundError('article', id);
  return article;
};

// 게시글 수정
export const updateArticle = async (id: number, data: ArticleData) => {
  const existing = await articleRepository.findById(id);
  if (!existing) throw new NotFoundError('article', id);
  return articleRepository.update(id, data);
};

// 게시글 삭제
export const deleteArticle = async (id: number) => {
  const article = await articleRepository.findById(id);
  if (!article) throw new NotFoundError('article', id);
  await articleRepository.delete(id);
};

// 게시글 목록 조회
export const listArticle = async ({
  page,
  pageSize,
  orderBy,
  keyword,
}: ArticleListQuery) => {
  const where = keyword ? { title: { contains: keyword } } : undefined;

  const totalCount = await articleRepository.count(where);
  const list = await articleRepository.findAll({ page, pageSize, orderBy, where });

  return {
    list,
    totalCount,
  };
};
