import { PrismaClient, NotificationType, Prisma } from '@prisma/client';
import type { Notification as NotificationModel } from '@prisma/client';

export type ListOptions = {
  unreadOnly?: boolean;
  take?: number;        
  cursor?: number;      
};

export class NotificationRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: {
    userId: number;
    actorId?: number;
    type: NotificationType;
    productId?: number;
    articleId?: number;
    message: string;
  }): Promise<NotificationModel> {
    return this.prisma.notification.create({ data });
  }

  list(userId: number, opts: ListOptions = {}): Promise<NotificationModel[]> {
    const { unreadOnly = false, take = 20, cursor } = opts;

    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
  }

  countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  markRead(id: number, userId: number): Promise<Prisma.BatchPayload> {
    return this.prisma.notification.updateMany({
      where: { id, userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  markAllRead(userId: number): Promise<Prisma.BatchPayload> {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }
}

export default NotificationRepository;
