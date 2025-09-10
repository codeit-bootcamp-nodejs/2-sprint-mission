import { Request, Response, NextFunction } from 'express';
import { CommentDto } from '../dtos/comments.dto';
import { ArticleCommentService } from '../services/articleCommentService';
import { plainToInstance } from 'class-transformer';

export class ArtricleCommentController {
    private articleCommentService: ArticleCommentService;

    constructor(articleCommentService: ArticleCommentService) {
        this.articleCommentService = articleCommentService;
    }

    createArticleComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = req.user.id;
        const articleId = Number(req.params.articleId);
        const commentData = plainToInstance(CommentDto, req.body)

        const newArticleComment = await this.articleCommentService.createArticleComment(user, articleId, commentData);

        res.status(201).json(newArticleComment);
    } catch (error) {
        console.error('Failed to create article comment:', error);
        next(error);
    }
    }

    updateArticleComment = async (req: Request, res: Response, next: NextFunction) => { 
        try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = req.user.id;
        const commentId = Number(req.params.commentId);
        const commentData = plainToInstance(CommentDto, req.body)

        const updatedComment = await this.articleCommentService.updateArticleComment(user, commentId, commentData);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Failed to update article comment:', error);
        next(error);
    }
    }

    deleteArticleComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const commentId = Number(req.params.commentId)
        const user = req.user.id;

        await this.articleCommentService.deleteArticleComment(user, commentId)
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete article comment:', error);
        next(error);
    }
    }
}
