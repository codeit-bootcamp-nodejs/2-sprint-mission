import { Prisma } from "@prisma/client";
import { ArticleRepository } from "../repositories/articleReporitory";
import {
  ArticleListOptions,
  ArticleOutput,
  ArticleOutputWithLiked,
  CreateArticlesDto,
  PatchArticleDto,
} from "../dtos/articles.dto";
import { ArticleLikeRepository } from "../repositories/articleLikeReporitory";

export class ArticleService {
  private articleRepository: ArticleRepository;
  private articleLikeRepository: ArticleLikeRepository;

  constructor(
    articleRepository: ArticleRepository,
    articleLikeRepository: ArticleLikeRepository
  ) {
    this.articleRepository = articleRepository;
    this.articleLikeRepository = articleLikeRepository;
  }
  async createArticle(
    userId: number,
    articleData: CreateArticlesDto
  ): Promise<ArticleOutput> {
    const createData: Prisma.ArticleCreateInput = {
      title: articleData.title,
      content: articleData.content,
      user: {
        connect: { id: userId },
      },
    };

    const newArticle = await this.articleRepository.create(createData);

    return { ...newArticle };
  }

  async updateArticle(
    articleId: number,
    userId: number,
    articleData: PatchArticleDto
  ): Promise<ArticleOutput> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    if (article.userId !== userId) {
      throw new Error("Unauthorized to update this article");
    }

    const articleUpdateData: Prisma.ArticleUpdateInput = {
      title: articleData.title,
      content: articleData.content,
    };

    const updatedArticle = await this.articleRepository.update(
      articleId,
      articleUpdateData
    );
    if (!updatedArticle) {
      throw new Error("Article update failed");
    }

    return { ...updatedArticle };
  }

  async deleteArticle(userId: number, articleId: number) {
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    if (article.userId !== userId) {
      throw new Error("Unauthorized to delete this article");
    }

    await this.articleRepository.delete(articleId);

    return { message: "Article deleted successfully" };
  }

  async myArticles(
    userId: number,
    options: ArticleListOptions
  ): Promise<ArticleOutput[]> {
    let orderBy: Prisma.ArticleOrderByWithRelationInput;
    switch (options.order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const myArticles = await this.articleRepository.findManyByUserId(userId, {
      skip: options.offset,
      take: options.limit,
      orderBy: orderBy,
    });

    return myArticles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      userId: article.userId,
      likeCount: article.likeCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));
  }

  async getArticleList(
    userId: number | null,
    options: ArticleListOptions
  ): Promise<ArticleOutputWithLiked[]> {
    let orderBy: Prisma.ArticleOrderByWithRelationInput;
    switch (options.order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // 게시글 목록 가져오기
    const getArticleList = await this.articleRepository.findManyArticles({
      skip: options.offset,
      take: options.limit,
      orderBy: orderBy,
    });

    //로그인한 사용자가 좋아요 누른 게시글 목록 가져오기
    let myLikedArticle: { articleId: number }[] = []
    if (userId) {
      myLikedArticle = await this.articleLikeRepository.findManyByUserId(
        userId
      )
    }

    // 좋아요 누른 게시글 ID를 Set으로 변환
    const likedArticleIds = new Set(
      myLikedArticle.map((like) => like.articleId)
    );

    //전체 게시글 목록에 isLiked 추가
    const articleWithLikedStatus: ArticleOutputWithLiked[] = getArticleList.map(
      (article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        userId: article.userId,
        likeCount: article.likeCount,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        isLiked: likedArticleIds.has(article.id),
      })
    );
    return articleWithLikedStatus;
  }
}
