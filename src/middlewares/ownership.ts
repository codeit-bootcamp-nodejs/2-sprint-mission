import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ModelType = 'product' | 'article' | 'comment';

export function requireOwnership(model: ModelType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    //// 각 모델에 맞는 id param 이름 설정
    const paramKey =
      model === 'product' ? 'id'
      : model === 'article' ? 'id'
      : model === 'comment' ? 'commentId'
      : 'id';

    const id = Number(req.params[paramKey]);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (model === 'product') {
        const record = await prisma.product.findUnique({ where: { id } });
        if (!record) return res.status(404).json({ message: 'Product not found' });
        if (record.ownerId !== req.user.id)
          return res.status(403).json({ message: 'No permission to access this product' });

      } else if (model === 'article') {
        const record = await prisma.article.findUnique({ where: { id } });
        if (!record) return res.status(404).json({ message: 'Article not found' });
        if (record.authorId !== req.user.id)
          return res.status(403).json({ message: 'No permission to access this article' });

      } else if (model === 'comment') {
        const record = await prisma.comment.findUnique({ where: { id } });
        if (!record) return res.status(404).json({ message: 'Comment not found' });
        if (record.authorId !== req.user.id)
          return res.status(403).json({ message: 'No permission to access this comment' });

      } else {
        return res.status(400).json({ message: 'Unknown model type for ownership check' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
