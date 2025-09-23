import express from 'express';
import NotificationService from '../service/notification/notification-service';
import passport from '../lib/passport/index';

const notificationController = express.Router();

const notificationService = new NotificationService();

// notificationRoute
notificationController.get('/',
	passport.authenticate('access-token', { session: false }),
	notificationService.getNotifications);
notificationController.get('/unread',
	passport.authenticate('access-token', { session: false }),
	notificationService.UnreadNotificationsCount);
notificationController.patch('/read/:notificationId',
	passport.authenticate('access-token', { session: false }),
	notificationService.readNotification);
	
export default notificationController;