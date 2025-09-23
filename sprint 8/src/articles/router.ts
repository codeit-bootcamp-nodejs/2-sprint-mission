// src/articles/router.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import ArticleService, { type CreateArticleDto } from './service';

type AuthedReq = Request & { user?: { id: number } };

export default function makeArticleRouter(svc: ArticleService) {
  const r = Router();

  // POST /articles  (게시글 생성)
  r.post('/', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const { title, content, image } = (req.body ?? {}) as CreateArticleDto;
      const t = String(title ?? '').trim();
      const c = String(content ?? '').trim();
      if (!t || !c) return res.status(400).json({ message: 'TITLE_CONTENT_REQUIRED' });

      const created = await svc.create(userId, { title: t, content: c, image });
      res.status(201).json(created);
    } catch (e) { next(e); }
  });

  // POST /articles/:id/comments  (댓글 생성 + 알림 트리거)
  r.post('/:id/comments', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const articleId = Number(req.params.id);
      if (!Number.isFinite(articleId)) return res.status(400).json({ message: 'INVALID_ID' });

      const content = String((req.body as any)?.content ?? '').trim();
      if (!content) return res.status(400).json({ message: 'CONTENT_REQUIRED' });

      const created = await svc.addComment(articleId, userId, content);
      res.status(201).json(created);
    } catch (e) { next(e); }
  });

  return r;
}
