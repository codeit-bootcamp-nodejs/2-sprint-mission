import { Request, Response, NextFunction, RequestHandler } from 'express';
import articleService from '../services/article.service';

const articleController = {
    // 게시글 전체 목록 조회
    getAllArticles: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await articleService.getAllArticles(req.query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    // 게시글 상세 목록 조회
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

    // 게시글 생성
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

    // 게시글 수정
    updateArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.id);

            // 작성자 확인을 위해 userId 포함해서 조회
            const article = await articleService.getArticleById(userId, articleId);

            // 작성자만 수정 가능
            if (article.userId !== userId) {
                return res.status(403).json({ message: '작성자 본인만 수정 가능' });
            }

            const result = await articleService.updateArticle({ id: articleId, data: req.body });

            res.status(200).json({ message: '게시글 수정 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    // 게시글 삭제
    deleteArticle: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.id);

            const article = await articleService.getArticleById(userId, articleId);

            if (Number(article.userId) !== Number(userId)) {
                return res.status(403).json({ message: '작성자 본인만 삭제 가능' });
            }

            const result = await articleService.deleteArticle(articleId);

            res.status(200).json({ message: '게시글 삭제 완료' });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    // 게시글 좋아요♥️
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

    // 게시글 좋아요❌
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
