import { db } from "../lib/db";
import { ArticleCreateDto, ArticleUpdateDto } from "../utils/dtos/articles.dto";

export const ArticleRepository = {
  findMany: (where: any, skip: number, take: number, orderBy?: any) => {
    return db.article.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  findById: (id: number) => {
    return db.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  create: (data: ArticleCreateDto & { userId: number }) => {
    return db.article.create({
      data,
    });
  },

  update: (id: number, data: ArticleUpdateDto) => {
    return db.article.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return db.article.delete({
      where: { id },
    });
  },

  findLike: (userId: number, articleId: number) => {
    return db.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  },

  createLike: (userId: number, articleId: number) => {
    return db.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });
  },

  deleteLike: (userId: number, articleId: number) => {
    return db.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  },
};
