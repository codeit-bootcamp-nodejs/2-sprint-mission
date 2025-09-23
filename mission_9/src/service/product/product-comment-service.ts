import express from 'express';
import ProductCommentRepository from '../../repository/product/product-comment-repository';

class ProductCommentService {
  static getProductComments: express.RequestHandler = async (req, res, next) => {
    let cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const orderBy = {
      createdAt: 'asc' as const
    };
    const search = req.query.search ? String(req.query.search) : undefined;
    const comments = await ProductCommentRepository.getProductComments(cursor, orderBy, search);
    let message
    if (comments instanceof Error) {
      return next(comments);
    }
    if(comments[2]) {
      message = `다음 커서는 ${comments[2].id}입니다.`;
    } else {
      message = '다음 커서가 없습니다.';
    }
    res.send({comments: comments, message: message});
  }

  static createProductComment: express.RequestHandler = async (req, res, next) => {
    try {
      const commnt = await ProductCommentRepository.createProductComment({
        ...req.body,
        userId: req.user!.id,
        productId:  parseInt(req.params.productId),
      });
      res.send(commnt);
    } catch (err) {
      next(err);
    }
  }

  static updateProductComment: express.RequestHandler = async (req, res, next) => {
    try {
      const id = Number(req.params.commentId);
      const comment = await ProductCommentRepository.getProductCommentByIdOrThrow(id);
      if (comment.user.id !== req.user!.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      const updatedComment = await ProductCommentRepository.updateProductComment(id, req.body);
      res.send(updatedComment);
    } catch (err) {
      if ((err as Error).code === 'P2025') {
        const error = new Error('ID not found');
        error.status = 404;
        return next(error);
      }
      next(err);
    }
  }

  static deleteProductComment: express.RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.commentId);
      const comment = await ProductCommentRepository.getProductCommentByIdOrThrow(id);
      if (comment.user.id !== req.user!.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      await ProductCommentRepository.deleteProductComment(id);
      res.sendStatus(204);
    } catch (err) {
      if ((err as Error).code === 'P2025') {
        const error = new Error('ID not found');
        error.status = 404;
        return next(error);
      }
      next(err);
    }
  }
}

export default ProductCommentService;