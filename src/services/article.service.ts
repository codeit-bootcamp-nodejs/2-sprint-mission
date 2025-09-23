import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ArticleService {
  static async createArticle(data: {
    title: string;
    content: string;
    authorId: number;
    imageUrl?: string;
  }) {
    return prisma.article.create({ data });
  }

  static async getArticleById(articleId: number, userId?: number) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { likes: true },
    });

    if (!article) return null;

    const isLiked = userId
      ? article.likes.some((like) => like.userId === userId)
      : false;

    const likeCount = article.likes.length;

    const { likes, ...rest } = article;
    return { ...rest, isLiked, likeCount };
  }

  static async updateArticle(articleId: number, data: any) {
    return prisma.article.update({
      where: { id: articleId },
      data,
    });
  }

  static async deleteArticle(articleId: number) {
    return prisma.article.delete({ where: { id: articleId } });
  }

  static async getArticleList(offset: number, limit: number, search: string) {
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
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        imageUrl: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  static async likeArticle(userId: number, articleId: number) {
    return prisma.articleLike.upsert({
      where: {
        userId_articleId: { userId, articleId },
      },
      create: {
        userId,
        articleId,
      },
      update: {},
    });
  }

  static async unlikeArticle(userId: number, articleId: number) {
    return prisma.articleLike.delete({
      where: {
        userId_articleId: { userId, articleId },
      },
    });
  }

  static async getArticleLikes(articleId: number) {
    const likes = await prisma.articleLike.findMany({
      where: { articleId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return likes.map((like) => like.user);
  }
}