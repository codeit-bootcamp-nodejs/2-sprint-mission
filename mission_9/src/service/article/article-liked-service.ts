import express from 'express';
import ArticleLikedRepository from '../../repository/article/article-liked-repository';
import ArticleRepository from '../../repository/article/article-repository';

class ArticleLikedService {

  static getArticleLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const articleLiked = await ArticleLikedRepository.getArticleLiked(Number(req.params.articleId), Number(req.user!.id));
      res.send(articleLiked);
    } catch(err) {
      next(err as Error);
    } 
  }
    
  static createArticleLiked: express.RequestHandler = async (req, res, next) => {
    try {
      await ArticleRepository.getArticleByIdOrThrow(Number(req.params.articleId));
      const articleLiked = await ArticleLikedRepository.getArticleLiked(Number(req.params.articleId), Number(req.user!.id));
      if (articleLiked !== null) {
        return next(new Error('이미 좋아요를 눌렀습니다.'));
      }
      await ArticleLikedRepository.createArticleLiked(Number(req.params.articleId), Number(req.user!.id));
      res.send({ message: '좋아요를 눌렀습니다.' });
    } catch(err) {
      next(err as Error);
    }
  }

  static deleteArticleLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const articleLiked = await ArticleLikedRepository.getArticleLiked(Number(req.params.articleId), Number(req.user!.id));
      if (!articleLiked) {
        return next(new Error('좋아요를 찾을 수 없습니다.'));
      }
      await ArticleLikedRepository.deleteArticleLiked(Number(req.params.articleId), Number(req.user!.id));
      res.send({ message: '좋아요를 취소했습니다.' });
    } catch(err) {
      next(err as Error);
    }
  }
}

export default ArticleLikedService;