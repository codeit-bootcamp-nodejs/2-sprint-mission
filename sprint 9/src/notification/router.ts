// src/notification/router.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import { NotificationType } from '@prisma/client';
import NotificationService from './service';

type AuthedReq = Request & { user?: { id: number } };

export default function makeNotificationRouter(svc: NotificationService) {
  const r = Router();

  r.get('/', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const unreadOnly = String(req.query.unreadOnly) === 'true';
      const takeRaw = Number(req.query.take ?? 20);
      const take = Math.min(Math.max(Number.isFinite(takeRaw) ? takeRaw : 20, 1), 100);
      const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

      const items = await svc.list(userId, { unreadOnly, take, cursor });
      res.json(items);
    } catch (e) { next(e); }
  });

  r.get('/unread-count', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });
      const count = await svc.countUnread(userId);
      res.json({ count });
    } catch (e) { next(e); }
  });

  r.patch('/:id/read', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });
      const id = Number(req.params.id);
      await svc.markRead(id, userId);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  r.patch('/read-all', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });
      await svc.markAllRead(userId);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  // 실시간 푸시 테스트
  r.post('/_test', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });
      const saved = await svc.create({
        userId,
        type: NotificationType.PRICE_CHANGED,
        message: 'test',
      });
      res.json(saved);
    } catch (e) { next(e); }
  });

  return r;
}
