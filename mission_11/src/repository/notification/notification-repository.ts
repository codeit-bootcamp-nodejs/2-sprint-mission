import prisma from "../../utills/prisma";
import { notificationDto } from "../../dto/index";

class NotificationRepository {
	getNotifications = async (userId: number) => {
		const notifications = await prisma.notification.findMany({
			where: {
				userId: userId,
			},
		});
		return notifications;
	}

	UnreadNotificationsCount = async (userId: number) => {
		const notificationsCount = await prisma.notification.count({
			where: {
				userId: userId,
				read: false,
			},
		});
		return notificationsCount;
	}
	
	findNotificationById = async (notificationId: number) => {
		const notification = await prisma.notification.findUnique({
			where: {
				id: notificationId,
			}
		})
		return notification;
	}

	readNotification = async (notificationId: number) => {
		try {
			const notification = await prisma.notification.update({
				where: {
					id: notificationId,
				},
				data: {
					read: true,
				}
			})
			return notification;
		} catch (err) {
			return err as Error;
		}
	}

	createNotification = async (createNotificationDto: notificationDto.CreateNotificationDto) => {
		try {
			const createNotification = await prisma.notification.create({
				data: createNotificationDto,
			})
			return createNotification;
		} catch (err) {
			return err as Error;
		}
	}
}

export default NotificationRepository;
