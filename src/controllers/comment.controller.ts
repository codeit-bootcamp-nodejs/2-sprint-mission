import { Request, Response, NextFunction } from "express";
import commentService from "../services/comment.service";
import {
  CreateProductCommentDto,
  UpdateProductCommentDto,
  CreateArticleCommentDto,
  UpdateArticleCommentDto,
  ProductCommentResponseDto,
  ArticleCommentResponseDto,
} from "../utils/dtos/comment.dto";

const commentController = {
  // 1️⃣ 상품
  // ✅ 상품 댓글 작성
  createProductComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);
      const data: CreateProductCommentDto = req.body;

      const result = await commentService.createProductComment(
        userId,
        productId,
        data
      );

      res.status(201).json({ message: "작성 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // ✅ 상품 댓글 전체 조회
  getAllProductComments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result: ProductCommentResponseDto[] =
        await commentService.getAllProductComments(req.query);

      res.status(200).json({ message: "조회 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // ✅ 상품 댓글 수정
  updateProductComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const commentId = Number(req.params.commentId);
      const data: UpdateProductCommentDto = req.body;

      const result = await commentService.updateProductComment(
        userId,
        commentId,
        data
      );

      res.status(200).json({ message: "수정 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // ✅ 상품 댓글 삭제
  deleteProductComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);
      const commentId = Number(req.params.commentId);
      await commentService.deleteProductComment(userId, productId, commentId);

      res.status(200).json({ message: "삭제 완료" });
    } catch (error) {
      next(error);
    }
  },

  // 2️⃣ 게시글
  // ✅ 게시글 댓글 작성
  createArticleCommnet: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      const data: CreateArticleCommentDto = req.body;

      const result = await commentService.createArticleComment(
        userId,
        articleId,
        data
      );

      res.status(201).json({ message: "작성 완료", result });
    } catch (error) {
      next(error);
    }
  },
  // ✅ 게시글 댓글 전체 조회
  getAllArticleComments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result: ArticleCommentResponseDto[] =
        await commentService.getAllArticleComments(req.query);

      res.status(200).json({ message: "조회 완료", result });
    } catch (error) {
      next(error);
    }
  },
  // ✅ 게시글 댓글 수정
  updateArticleCommnent: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const commentId = Number(req.params.commentId);
      const data: UpdateArticleCommentDto = req.body;

      const result = await commentService.updateArticleComment(
        userId,
        commentId,
        data
      );
      res.status(200).json({ message: "수정 완료", result });
    } catch (error) {
      next(error);
    }
  },
  // ✅ 게시글 댓글 삭제
  deleteArticleComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      const commentId = Number(req.params.commentId);

      await commentService.deleteArticleComment(userId, articleId, commentId);

      res.status(200).json({ message: "삭제 완료" });
    } catch (error) {
      next(error);
    }
  },
};

export default commentController;
