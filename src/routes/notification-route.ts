import express from 'express';
import authenticate from '../middlewares/authenticate';
import notificationController from '../controllers/notification-controller';

const router = express.Router();

router.get('/notifications', authenticate, notificationController.getMyNotification.bind(notificationController));
router.get('/notreadcount', authenticate, notificationController.getMyNotReadNotification.bind(notificationController));
router.patch('/notifications/:id/read', authenticate, notificationController.changeMyReadStatus.bind(notificationController));

export default router;
