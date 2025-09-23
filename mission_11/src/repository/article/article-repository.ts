import prisma from "../../utills/prisma";
import { Prisma } from "@prisma/client";

class ArticleRepository {
  static getArticlelist = async (offset: number, limit: number, orderBy: { createdAt: 'asc' | 'desc' }, search: string | undefined) => {
    try {
      const articles = await prisma.article.findMany({
        skip: offset,
        take: limit,
        orderBy: orderBy,
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' }},
            { content: { contains: search, mode: 'insensitive' }},
          ],
        },
        include: {
          articleLiked: true,
          articleComments: true,
          user: true,
        }
      });
      return articles;
    } catch(err) {
      return err as Error;
    }
  }

  static getArticleByIdOrThrow = async (articleId: number) => {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: articleId
      },
      include: {
        articleLiked: true,
        articleComments: true,
        user: true,
      }
    });
    return article;
  }

  static createArticle = async (article:Prisma.ArticleCreateInput) => {
    try {
      const newArticle = await prisma.article.create({ data: article });
      return newArticle;
    } catch(err) {
      return err as Error;
    }
  }

  static updateArticle = async (id: number, article:Prisma.ArticleUpdateInput) => {
    try {
      const updatedArticle = await prisma.article.update({ where: { id: id }, data: article });
      return updatedArticle;
    } catch(err) {
      return err as Error;
    }
  }

  static deleteArticle = async (id: number) => {
    try {
      const deletedArticle = await prisma.article.delete({ where: { id: id } });
      return deletedArticle;
    } catch(err) {
      return err as Error;
    }
  }

  static getUserArticles = async (userId: number) => {
    try {
      const articles = await prisma.article.findMany({ where: { userId: userId } });
      return articles;
    } catch(err) {
      return err as Error;
    }
  }
}

export default ArticleRepository;