import { Router, type Request, type Response, type NextFunction } from 'express';
import NotificationService from './service';

type AuthedReq = Request & { user?: { id: number } };

export const notificationRouter = (svc: NotificationService) => {
  const r = Router();

  // GET /notifications?unreadOnly=true&take=20&cursor=123
  r.get('/', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const unreadOnly = String(req.query.unreadOnly) === 'true';
      const take = Number(req.query.take ?? 20) || 20;
      const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

      const items = await svc.list(userId, { unreadOnly, take, cursor });
      res.json(items);
    } catch (e) { next(e); }
  });

  // GET /notifications/unread-count
  r.get('/unread-count', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const count = await svc.countUnread(userId);
      res.json({ count });
    } catch (e) { next(e); }
  });

  // PATCH /notifications/:id/read
  r.patch('/:id/read', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const id = Number(req.params.id);
      await svc.markRead(id, userId);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  // PATCH /notifications/read-all
  r.patch('/read-all', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      await svc.markAllRead(userId);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return r;
};

export default notificationRouter;
