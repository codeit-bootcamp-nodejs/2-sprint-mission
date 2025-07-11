import { ArticleRepository } from "../repositories/article.repository";
import HttpError from "../types/httpError";
import { ArticleCreateDto, ArticleUpdateDto, GetArticlessQuery } from "../utils/dtos/articles.dto";

export const ArticleService = {
  getArticles: async (query: GetArticlessQuery) => {
    const { page = 1, pageSize = 10, sort = "recent", search = "" } = query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    };

    const orderBy = sort === "recent" ? { id: "desc" } : undefined;

    const articles = await ArticleRepository.findMany(
      where,
      skip,
      take,
      orderBy
    );

    return {
      page: Number(page),
      pageSize: Number(pageSize),
      articles,
    };
  },

  createArticle: async (data: ArticleCreateDto, userId: number) => {
    return await ArticleRepository.create({
      ...data,
      userId,
    });
  },
  
  getArticleById: async (articleId: number, userId: number) => {
    const article = await ArticleRepository.findById(articleId);
    if (!article) throw new HttpError(404);

    let isLiked = false;

    if (userId) {
      const like = await ArticleRepository.findLike(userId, articleId);
      isLiked = !!like;
    }

    return { article, isLiked };
  },

  updateArticle: async (id: number, data: ArticleUpdateDto) => {
    const article = await ArticleRepository.findById(id);
    if (!article) throw new HttpError(404);

    const updatedArticle = await ArticleRepository.update(id, data);
    return updatedArticle;
  },

  deleteArticle: async (id: number) => {
    const article = await ArticleRepository.findById(id);
    if (!article) throw new HttpError(404);

    await ArticleRepository.delete(id);
  },

  toggleArticleLike: async (userId: number, articleId: number) => {
    const existingLike = await ArticleRepository.findLike(userId, articleId);

    if (existingLike) {
      await ArticleRepository.deleteLike(userId, articleId);
      return {
        message: "좋아요 취소 완료!",
        liked: false,
        userId,
        articleId,
      };
    } else {
      await ArticleRepository.createLike(userId, articleId);
      return {
        message: "좋아요 완료!",
        liked: true,
        userId,
        articleId,
      };
    }
  },
};
