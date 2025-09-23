import * as notificationsRepository from '../repositories/notificationsRepository';
import { socketManager } from '../lib/socketManager';

export async function createAndSendNotification(data: {
  type: string;
  message: string;
  userId: number;
  relatedId?: number;
}) {
  const notification = await notificationsRepository.createNotification(data);
  socketManager.sendNotification(data.userId, notification);
  return notification;
}

export async function getNotifications(userId: number) {
  return await notificationsRepository.getNotifications(userId);
}

export async function getUnreadCount(userId: number) {
  return await notificationsRepository.getUnreadCount(userId);
}

export async function markAsRead(id: number, userId: number) {
  return await notificationsRepository.markAsRead(id, userId);
}
