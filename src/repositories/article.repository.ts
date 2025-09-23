import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ArticleRepository = {
  createArticle: (data: { title: string; content: string; authorId: number; imageUrl?: string }) => {
    return prisma.article.create({ data });
  },

  getArticleById: (id: number) => {
    return prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, nickname: true, image: true } },
        likes: true,
      },
    });
  },

  getArticleList: (offset: number, limit: number, search: string) => {
    return prisma.article.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  updateArticle: (id: number, data: { title?: string; content?: string; imageUrl?: string }) => {
    return prisma.article.update({
      where: { id },
      data,
    });
  },

  deleteArticle: (id: number) => {
    return prisma.article.delete({ where: { id } });
  },

  likeArticle: (userId: number, articleId: number) => {
    return prisma.articleLike.upsert({
      where: {
        userId_articleId: { userId, articleId },
      },
      create: { userId, articleId },
      update: {},
    });
  },

  unlikeArticle: (userId: number, articleId: number) => {
    return prisma.articleLike.delete({
      where: {
        userId_articleId: { userId, articleId },
      },
    });
  },

  getArticleLikes: (articleId: number) => {
    return prisma.articleLike.findMany({
      where: { articleId },
      include: {
        user: {
          select: { id: true, nickname: true, image: true },
        },
      },
    });
  },
};
