import articleRepository from "../repositories/article.repository";
import {
  ArticleResponseDto,
  CreateArticleDto,
  UpdateArticleDto,
} from "../utils/dtos/article.dto";

const articleService = {
  createArticle: async (
    userId: number,
    data: CreateArticleDto
  ): Promise<ArticleResponseDto> => {
    return await articleRepository.createArticle(userId, data);
  },

  getAllArticles: async (): Promise<ArticleResponseDto[]> => {
    return await articleRepository.getAllArticles();
  },

  getArticleById: async (articleId: number): Promise<ArticleResponseDto> => {
    return await articleRepository.getArticleById(articleId);
  },

  updateArticle: async (
    userId: number,
    articleId: number,
    data: UpdateArticleDto
  ): Promise<ArticleResponseDto> => {
    const updated = await articleRepository.updateArticle(
      userId,
      articleId,
      data
    );
    if (!updated) {
      throw new Error("게시글 없음");
    }
    return updated;
  },

  deleteArticle: async (userId: number, articleId: number): Promise<void> => {
    const deleted = await articleRepository.deleteArticle(userId, articleId);
    if (!deleted) {
      throw new Error("게시글 없음");
    }
  },

  likeArticle: async (userId: number, articleId: number) => {
    const existing = await articleRepository.hasLikedArticle(userId, articleId);

    if (existing) {
      throw new Error("이미 좋아요 했음");
    }

    return await articleRepository.likeArticle(userId, articleId);
  },

  unlikeArticle: async (userId: number, articleId: number) => {
    return await articleRepository.unlikeArticle(userId, articleId);
  },
};

export default articleService;
