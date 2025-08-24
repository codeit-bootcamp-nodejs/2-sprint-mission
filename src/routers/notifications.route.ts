// @ts-nocheck
import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import * as controller from '../controllers/notificationscontroller';

const router = Router();

router.use(authenticate);

// 목록 (page, limit)
router.get('/', controller.getMyNotifications);

// 미읽음 개수
router.get('/unread-count', controller.getUnreadCount);

// 읽음 처리
router.patch('/:id/read', controller.readMyNotification);

export default router;
