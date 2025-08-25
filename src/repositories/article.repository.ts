import db from "../config/db";
import {
  ArticleResponseDto,
  CreateArticleDto,
  UpdateArticleDto,
} from "../utils/dtos/article.dto";

const articleRepository = {
  createArticle: async (
    userId: number,
    data: CreateArticleDto
  ): Promise<ArticleResponseDto> => {
    return await db.article.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  getAllArticles: async (): Promise<ArticleResponseDto[]> => {
    return await db.article.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getArticleById: async (articleId: number): Promise<ArticleResponseDto> => {
    const article = await db.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new Error("게시글 없음");
    }
    return article;
  },

  updateArticle: async (
    userId: number,
    articleId: number,
    data: UpdateArticleDto
  ): Promise<ArticleResponseDto | null> => {
    const response = await db.article.updateMany({
      where: { id: articleId, userId },
      data,
    });
    if (response.count === 0) return null;
    return db.article.findUnique({ where: { id: articleId } }) as any;
  },

  deleteArticle: async (
    userId: number,
    articleId: number
  ): Promise<boolean> => {
    const response = await db.article.delete({
      where: { id: articleId, userId },
    });
    return !!response;
  },

  likeArticle: async (userId: number, articleId: number) => {
    return await db.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });
  },

  unlikeArticle: async (userId: number, articleId: number) => {
    return await db.articleLike.deleteMany({
      where: {
        userId,
        articleId,
      },
    });
  },

  hasLikedArticle: async (userId: number, articleId: number) => {
    return await db.articleLike.findFirst({
      where: {
        userId,
        articleId,
      },
    });
  },
};

export default articleRepository;
