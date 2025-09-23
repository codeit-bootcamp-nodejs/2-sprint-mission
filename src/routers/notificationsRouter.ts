import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import * as notificationsController from '../controllers/notificationsController';

const router = Router();

router.get('/', authenticate(), withAsync(notificationsController.getNotifications));
router.get('/unread-count', authenticate(), withAsync(notificationsController.getUnreadCount));
router.patch('/:id/read', authenticate(), withAsync(notificationsController.markAsRead));

export default router;
