import { prismaClient } from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

// 새롭게 정의하거나 기존 type 파일에 작성
type CreateArticleInput = {
  title: string;
  content: string;
  tags?: string[];
};

type UpdateArticleInput = Partial<CreateArticleInput>;

type ArticleListQuery = {
  page: number;
  pageSize: number;
  orderBy?: 'recent' | 'old';
  where?: Prisma.ArticleWhereInput;
};

export const createArticle = (data: CreateArticleInput) => {
  return prismaClient.article.create({ data });
};

export const getArticle = (id: number) => {
  return prismaClient.article.findUnique({ where: { id } });
};

export const updateArticle = (id: number, data: UpdateArticleInput) => {
  return prismaClient.article.update({ where: { id }, data });
};

export const deleteArticle = (id: number) => {
  return prismaClient.article.delete({ where: { id } });
};

export const count = (where?: Prisma.ArticleWhereInput) => {
  return prismaClient.article.count({ where });
};

export const findAll = ({ page, pageSize, orderBy = 'recent', where }: ArticleListQuery) => {
  return prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });
};
