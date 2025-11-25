import { prismaClient } from '../lib/prismaClient';

export async function createNotification(data: {
  type: string;
  message: string;
  userId: number;
  relatedId?: number;
}) {
  return await prismaClient.notification.create({ data });
}

export async function getNotifications(userId: number) {
  return await prismaClient.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUnreadCount(userId: number) {
  return await prismaClient.notification.count({
    where: { userId, isRead: false },
  });
}

export async function markAsRead(id: number, userId: number) {
  return await prismaClient.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}
