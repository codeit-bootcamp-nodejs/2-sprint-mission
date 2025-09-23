import express from 'express';
import ArticleCommentRepository from '../../repository/article/article-comment-repository';
import NotificationService from '../notification/notification-service';
import ArticleRepository from '../../repository/article/article-repository';

const notificationService = new NotificationService();

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
    // 댓글 생성시 작성자에게 알림 생성
    const article = await ArticleRepository.getArticleByIdOrThrow(Number(req.params.articleId));
    const notification = await notificationService.createNotification({
      userId: article.userId,
      type: 'comment',
      content: `게시글 ${article.title}에 댓글이 달렸습니다.`,
    });
    if (notification instanceof Error) {
      return next(notification);
    }
    res.send(Comment);
  }

  static updateArticleComment: express.RequestHandler = async (req, res, next) => {
    try {
      const id = Number(req.params.commentId);
      const comment = await ArticleCommentRepository.getArticleCommentByIdOrThrow(id);
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