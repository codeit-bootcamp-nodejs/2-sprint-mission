import { db } from '../utils/db';

export const commentRepository = {
  createProductComment: (data: { userId: number; product_id: number; content: string }) =>
    db.comment.create({ data }),

  createArticleComment: (data: { userId: number; article_id: number; content: string }) =>
    db.comment.create({ data }),

  findCommentById: (id: number) =>
    db.comment.findUnique({ where: { id } }),

  updateComment: (id: number, content: string) =>
    db.comment.update({
      where: { id },
      data: { content },
    }),

  deleteComment: (id: number) =>
    db.comment.delete({ where: { id } }),

  getProductCommentList: () =>
    db.comment.findMany({
      where: { article_id: null },
      select: { id: true, content: true, createdAt: true },
      take: 10,
      skip: 0,
      cursor: { id: 1 },
      orderBy: { id: 'asc' },
    }),

  getArticleCommentList: () =>
    db.comment.findMany({
      where: { product_id: null },
      select: { id: true, content: true, createdAt: true },
      take: 10,
      skip: 0,
      cursor: { id: 1 },
      orderBy: { id: 'asc' },
    }),

  findProductById: (product_id: number) =>
    db.product.findUnique({ where: { id: product_id } }),

  findArticleById: (article_id: number) =>
    db.article.findUnique({ where: { id: article_id } }),
};
