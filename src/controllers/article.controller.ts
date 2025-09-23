import { Request, Response, NextFunction } from "express";
import articleService from "../services/article.service";
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleResponseDto,
} from "../utils/dtos/article.dto";

// 08.25 : 권한 검증 추가

const articleController = {
  // 게시글 작성
  createArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data: CreateArticleDto = req.body;
      const result: ArticleResponseDto = await articleService.createArticle(
        userId,
        data
      );

      res.status(201).json({ message: "작성 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // 전체 게시글 목록 조회
  getAllArticles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await articleService.getAllArticles();
      res.status(200).json({ message: "조회 완료", result });
    } catch (error) {
      next(error);
    }
  },
  // 게시글 상세 조회
  getArticleById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articleId = Number(req.params.articleId);
      const result = await articleService.getArticleById(articleId);

      res.status(200).json({ message: "조회 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // 게시글 수정
  updateArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      const data: UpdateArticleDto = req.body;
      const result: ArticleResponseDto = await articleService.updateArticle(
        userId,
        articleId,
        data
      );

      res.status(200).json({ message: "수정 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // 게시글 삭제
  deleteArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      await articleService.deleteArticle(userId, articleId);

      res.status(200).json({ message: "삭제 완료" });
    } catch (error) {
      next(error);
    }
  },

  // 좋아요
  likeArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      const result = await articleService.likeArticle(userId, articleId);

      res.status(200).json({ message: "좋아요", result });
    } catch (error) {
      next(error);
    }
  },

  // 좋아요 취소
  unlikeArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      await articleService.unlikeArticle(userId, articleId);

      res.status(200).json({ message: "좋아요 취소" });
    } catch (error) {
      next(error);
    }
  },
};

export default articleController;
