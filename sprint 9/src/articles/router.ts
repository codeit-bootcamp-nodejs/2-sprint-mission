// src/articles/router.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import ArticleService, { type CreateArticleDto, type UpdateArticleDto } from './service';

type AuthedReq = Request & { user?: { id: number } };

export default function makeArticleRouter(svc: ArticleService) {
  const r = Router();

  // ── 공개 API ─────────────────────────────────────────────
  // GET /articles
  r.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await svc.list();
      res.status(200).json(items);
    } catch (e) { next(e); }
  });

  // GET /articles/:id
  r.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      const found = await svc.getById(id);
      if (!found) return res.status(404).json({ message: 'NOT_FOUND' });
      res.status(200).json(found);
    } catch (e) { next(e); }
  });

  // ── 인증 필요 API ────────────────────────────────────────
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

  // PATCH /articles/:id  (게시글 수정)
  r.patch('/:id', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      const patch = (req.body ?? {}) as UpdateArticleDto;
      const updated = await svc.update(id, patch);
      res.status(200).json(updated);
    } catch (e) { next(e); }
  });

  // DELETE /articles/:id  (게시글 삭제)
  r.delete('/:id', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      await svc.remove(id);
      res.status(204).end();
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
