import { NextFunction, Request, Response } from "express";
import { ArticleService } from "../services/articleService";
import { plainToInstance } from "class-transformer";
import { CreateArticlesDto, PatchArticleDto } from "../dtos/articles.dto";

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  //로그인한 사용자의 게시글 등록
  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const articleData = plainToInstance(CreateArticlesDto, req.body);
      const userId = req.user.id;

      const newArticle = await this.articleService.createArticle(
        userId,
        articleData
      );

      res
        .status(201)
        .json({ message: "Article created successfully", article: newArticle });
    } catch (error) {
      console.error("Failed to create article:", error);
      next(error);
    }
  };

  //로그인한 사용자의 게시글 수정
  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const articleId = Number(req.params.id);
      const user = req.user.id;
      const updateData = plainToInstance(PatchArticleDto, req.body);

      const updatedArticle = await this.articleService.updateArticle(
        articleId,
        user,
        updateData
      );

      res.status(200).json({
        message: "Article updated successfully!",
        article: updatedArticle,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      next(error);
    }
  };

  //로그인한 사용자의 게시글 삭제
  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const articleId = Number(req.params.id);
      const user = req.user.id;

      await this.articleService.deleteArticle(user, articleId);
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete article:", error);
      next(error);
    }
  };

  //로그인한 사용자가 작성한 게시글 목록
  getMyArticleList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user.id;

      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const order = (req.query.order as "newest" | "oldest") || "newest";

      const articles = await this.articleService.myArticles(user, {
        offset,
        limit,
        order,
      });
      res.status(200).json(articles);
    } catch (error) {
      console.error(`Error fetching user's articles:`, error);
      next(error);
    }
  };

  //게시글 목록조회 (isLiked 추가)
  getArticleList = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const user = req.user ? req.user.id: null;

      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const order = (req.query.order as "newest" | "oldest") || "newest";

      const articles = await this.articleService.getArticleList(user, {
        offset,
        limit,
        order,
      });
      res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching article list with like status:", error);
      next(error);
    }
  };
}
