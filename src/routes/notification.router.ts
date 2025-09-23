import { Router } from 'express';
import type { Request } from 'express';
import { listMyNotifications, countUnread, markRead, markAllRead } from '../services/notification.service';
import { authenticate } from '../middlewares/auth';

type AuthedRequest = Request & { user?: { id: number } }; 

const router = Router();

router.use(authenticate);

// 알림
router.get('/notifications', async (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 20);
  res.json(await listMyNotifications(userId, page, pageSize));
});

// 알림 개수
router.get('/notifications/unread/count', async (req: any, res) => {
  const userId = (req as AuthedRequest).user!.id;
  const cnt = await countUnread(userId);
  res.json({ count: cnt });
});

// 알림 읽음 처리
router.patch('/notifications/:id/read', async (req: any, res) => {
  const userId = (req as AuthedRequest).user!.id;
  const id = Number(req.params.id);
  const result = await markRead(userId, id);
  res.json({ updated: result.count });
});

// 모든 알림 읽음 처리
router.patch('/notifications/read-all', async (req: any, res) => {
  const userId = (req as AuthedRequest).user!.id;
  const result = await markAllRead(userId);
  res.json({ updated: result.count });
});

export default router;
