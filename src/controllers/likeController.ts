import { NextFunction, Request, Response } from 'express';
import { LikeService } from '../services/likeService';

export class LikeController {
    private likeService: LikeService;

    constructor(likeService: LikeService) {
        this.likeService = likeService;
    }

    uploadLikeProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const productId = Number(req.params.productId)
        const user = req.user.id;

        const updateProductLike = await this.likeService.updateProductLike(user, productId);
        return res.status(200).json(updateProductLike);

    } catch (error) {
        console.error('Error in uploadLikeProduct:', error);
        next(error);
    }
    }

    uploadLikeArticle = async (req: Request, res: Response, next: NextFunction) => {
        try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const articleId = Number(req.params.articleId)
        const user = req.user.id;


        const updateArticleLike = await this.likeService.updateArticleLike(user, articleId)
        return res.status(200).json(updateArticleLike);

    } catch (error) {
        console.error('Error in uploadLikeArticle:', error)
        next(error)
    }
    }
}

