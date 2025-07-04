import { Request, Response, NextFunction, RequestHandler } from 'express';
import commentService from '../services/comment.service.ts';

const commentController = {
    getAllProductComments: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await commentService.getAllProductComments(req.params.productId, req.query);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }) as RequestHandler,

    createProductComment: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.productId);
            const content = req.body.content;

            const result = await commentService.createProductComment({ productId, content, userId });

            res.status(201).json({ message: '댓글 작성 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    updateProductComment: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.productId);
            const commentId = Number(req.params.commentId);
            const content = req.body.content;

            const result = await commentService.updateProductComment({ productId, commentId, userId, content });

            res.status(200).json({ message: '댓글 수정 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    deleteProductComment: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.productId);
            const commentId = Number(req.params.commentId);

            await commentService.deleteProductComment(userId, productId, commentId);

            res.status(200).json({ message: '댓글 삭제 완료' });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    getAllArticleComments: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await commentService.getAllArticleComments(req.params.articleId, req.query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    createArticleComment: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.articleId);
            const content = req.body.content;

            const result = await commentService.createArticleComment({ userId, articleId, content });

            res.status(201).json({ message: '댓글 작성 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    updateArticleComment: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.articleId);
            const commentId = Number(req.params.commentId);
            const content = req.body.content;

            const result = await commentService.updateArticleComment({ userId, articleId, commentId, content });

            res.status(200).json({ message: '댓글 수정 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    deleteArticleComment: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const articleId = Number(req.params.articleId);
            const commentId = Number(req.params.commentId);

            const result = await commentService.deleteArticleComment(userId, articleId, commentId);

            res.status(200).json({ message: '댓글 삭제 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,
};

export default commentController;