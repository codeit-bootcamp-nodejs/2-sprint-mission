import { notificationRepository } from "../repositories/notification.repository";
import { io } from "../socket";

type NotificationType = "comment" | "price-change" | "system" | "like";

export const notificationService = {
  notify: async (
    userId: number,
    type: NotificationType,
    message: string,
  ) => {
    const notification = await notificationRepository.createNotification(userId, type, message);

    if (userId) {
      io.to(userId.toString()).emit("notification", {
        id: notification.id,
        type: notification.type,
        message: notification.message,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  },

  getNotifications: async (userId: number) => {
    return await notificationRepository.getUserNotifications(userId);
  },

  getUnreadCount: async (userId: number) => {
    return await notificationRepository.countUnread(userId);
  },

  readNotification: async (id: number) => {
    return await notificationRepository.markAsRead(id);
  },
};


