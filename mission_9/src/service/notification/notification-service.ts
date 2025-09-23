import express from 'express';
import NotificationRepository from '../../repository/notification/notification-repository';
import { notificationDto } from '../../dto/index';
import { io } from '../../app';

class NotificationService {
	private notificationRepository = new NotificationRepository();
	// 알림 조회
	getNotifications: express.RequestHandler = async (req, res, next) => {
		try {
			const notifications = await this.notificationRepository.getNotifications(req.user!.id);
			if (notifications === null) {
				res.status(200).json({ message: '알림이 없습니다.' });
				return;
			}
			res.json(notifications);
		} catch (err) {
			next(err);
		}
	}

	// 안 읽은 알림 조회
	UnreadNotificationsCount: express.RequestHandler = async (req, res, next) => {
		try {
			const notifications = await this.notificationRepository.UnreadNotificationsCount(req.user!.id);
			res.json(notifications);
		} catch (err) {
			next(err);
		}
	}

	// 알림 읽음 처리
	readNotification: express.RequestHandler = async (req, res, next) => {
		try {
			const notificationId = Number(req.params.notificationId);
			const userId = (req.user!.id);
			const notification = await this.notificationRepository.findNotificationById(notificationId)
			if (notification === null) {
				res.status(200).json({ message: '알림을 찾을 수 없습니다.' });
				return;
			}
			const isMatched = notification.userId === userId;
			if (!isMatched) {
				res.status(403).json({ message:'인증되지 않은 사용자입니다.' });
				return;
			}
			const readNotification = await this.notificationRepository.readNotification(notificationId);
			if (readNotification instanceof Error) {
				return next(readNotification);
			}
			res.json(readNotification);
		} catch (err) {
			next(err);
		}
	}

	// 알림 생성
	createNotification = async (createNotificationDto: notificationDto.CreateNotificationDto) => {
		try {
			const createNotification = await this.notificationRepository.createNotification(createNotificationDto);
			if (createNotification instanceof Error) {
				return createNotification;
			}
			// 웹소켓에 로그인된 유저에게 알림 전송
			const message = {
				message: `알림이 도착했습니다.`,
			}
			io.to(createNotificationDto.userId.toString()).emit('notification', message);
			return createNotification;
		} catch (err) {
			return err;
		}
	}

	// 알림 일괄 생성
	batchCreateNotifications = async (userIds: number[], type: string, content: string) => {
		try {
			const createNotifications: notificationDto.CreateNotificationDto[] = [];
			for (const userId of userIds) {
				const createNotificationDto: notificationDto.CreateNotificationDto = {
					userId: userId,
					type: type,
					content: content,
				}
				const createNotification = await this.notificationRepository.createNotification(createNotificationDto);
				if (createNotification instanceof Error) {
					return createNotification;
				}
				const message = {
					message: `알림이 도착했습니다.`,
				}
				io.to(userId.toString()).emit('notification', message);
				createNotifications.push(createNotification);
			}
			return createNotifications;
		} catch (err) {
			return err;
		}
	}
}

export default NotificationService;
