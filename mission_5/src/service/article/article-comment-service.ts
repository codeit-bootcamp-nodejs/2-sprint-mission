import express from 'express';
import ArticleCommentRepository from '../../repository/article/article-comment-repository';

class ArticleCommentService {
  static getArticleComments: express.RequestHandler = async (req, res, next) => {
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const orderBy: { createdAt: 'asc' | 'desc' } = { createdAt: 'asc' };
    const comments = await ArticleCommentRepository.getArticleCommentlist(orderBy, cursor);
    let message
    if (!(comments instanceof Error)) {
      if(comments[2]) {
        message = `다음 커서는 ${comments[2].id}입니다.`;
      } else {
        message = '다음 커서가 없습니다.';
      }
    }
    res.send({message: message, comments: comments});
  }

  static createArticleComment: express.RequestHandler = async (req, res, next) => {
    const Comment = await ArticleCommentRepository.createArticleComment({
      ...req.body,
      userId: req.user!.id,
      articleId: Number(req.params.articleId),
    });
    res.send(Comment);
  }

  static updateArticleComment: express.RequestHandler = async (req, res, next) => {
    try {
      const id = Number(req.params.commentId);
      const comment = await ArticleCommentRepository.getArticleCommentByIdOrThrow(id);
      if (!comment) {
        const err = new Error('comment를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (comment.userId !== req.user!.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 403;
        return next(err);
      }
      const updatedComment = await ArticleCommentRepository.updateArticleComment({ ...req.body }, id);
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

  static deleteArticleComment: express.RequestHandler = async (req, res, next) => {
    try {
      const id = Number(req.params.commentId);
      const comment = await ArticleCommentRepository.getArticleCommentByIdOrThrow(id);
      if (!comment) {
        const err = new Error('comment를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (comment.userId !== req.user!.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 403;
        return next(err);
      }
      await ArticleCommentRepository.deleteArticleComment(id);
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

export default ArticleCommentService;