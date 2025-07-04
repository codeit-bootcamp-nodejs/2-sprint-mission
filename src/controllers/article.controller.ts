import { Request, Response, NextFunction, RequestHandler } from 'express';
import articleService from '../services/article.service.ts';

const articleController = {
    getAllArticles: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await articleService.getAllArticles(req.query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    getArticleById: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.user?.id);
            const articleId = Number(req.params.id);
            const result = await articleService.getArticleById(userId, articleId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    createArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });
            const result = await articleService.createArticle({ ...req.body, userId });
            res.status(201).json({ message: '게시글 생성 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    updateArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.id);
            const result = await articleService.updateArticle(userId, articleId, req.body);
            res.status(200).json({ message: '게시글 수정 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    deleteArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.id);
            await articleService.deleteArticle(userId, articleId);
            res.status(200).json({ message: '게시글 삭제 완료' });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    likeArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.articleId);
            const result = await articleService.likeArticle(userId, articleId);
            res.status(200).json({ message: '좋아요~♥️', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    unlikeArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.articleId);
            const result = await articleService.unlikeArticle(userId, articleId);
            res.status(200).json({ message: '좋아요 취소~♥️', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,
};

export default articleController;
