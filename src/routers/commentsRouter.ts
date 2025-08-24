// @ts-nocheck
// src/routers/notificationsRouter.ts
import { Router } from 'express';
import * as controller from '../controllers/commentsController';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.use(authenticate);

// 목록 조회 (page, limit)
router.get('/', controller.list);

// 미읽음 개수
router.get('/unread-count', controller.unreadCount);

// 읽음 처리
router.patch('/:id/read', controller.readOne);

export default router;


