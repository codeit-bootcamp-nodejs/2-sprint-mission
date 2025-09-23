import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

// 상품 댓글 생성
export const createProductComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CreateCommentDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const productId = parseInt(req.params.productId, 10);
    const comment = await CommentService.createProductComment(productId, req.user!.id, parsed.data);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// 게시글 댓글 생성
export const createArticleComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CreateCommentDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const articleId = parseInt(req.params.articleId, 10);
    const comment = await CommentService.createArticleComment(articleId, req.user!.id, parsed.data);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 목록 조회
export const getProductComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const take = req.query.take ? parseInt(req.query.take as string) : 10;

    const comments = await CommentService.getProductComments(productId, cursor, take);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

// 게시글 댓글 목록 조회
export const getArticleComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const take = req.query.take ? parseInt(req.query.take as string) : 10;

    const comments = await CommentService.getArticleComments(articleId, cursor, take);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = UpdateCommentDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const commentId = parseInt(req.params.commentId);
    const updated = await CommentService.updateComment(commentId, parsed.data);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = parseInt(req.params.commentId);
    await CommentService.deleteComment(commentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
