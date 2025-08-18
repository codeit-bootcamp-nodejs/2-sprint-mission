import { db } from "../lib/db";

export const notificationRepository = {
  createNotification: async (userId: number, type: string, message: string) => {
    return await db.notification.create({
      data: { userId, type, message }
    });
  },

  getUserNotifications: async (userId: number) => {
    return await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  countUnread: async (userId: number) => {
    return await db.notification.count({
      where: { userId, isRead: false }
    });
  },

  markAsRead: async (id: number) => {
    return await db.notification.update({
      where: { id },
      data: { isRead: true }
    });
  },
};





