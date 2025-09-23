import { PrismaClient, NotificationType } from '@prisma/client';
import { emitToUser } from '../socket';

const prisma = new PrismaClient();

// CreateArgs 타입 정의
type CreateArgs = {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  productId?: number;
  articleId?: number;
  commentId?: number;
}; 

// 알림 생성
export async function createAndPushNotification(args: CreateArgs) {
  const n = await prisma.notification.create({
    data: {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,      
      productId: args.productId,
      articleId: args.articleId,
      commentId: args.commentId,
    },
  });

  // 소켓을 통해 사용자에게 알림 전송
  emitToUser(args.userId, 'notification:new', {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,    
    createdAt: n.createdAt,
  });

  return n;
}

// 알림 목록 조회
export async function listMyNotifications(userId: number, page = 1, pageSize = 20) {
  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);
  return { items, total, page, pageSize };
}

// 알림 개수 조회
export async function countUnread(userId: number) {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

// 알림 읽음 처리
export async function markRead(userId: number, notificationId: number) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId, readAt: null },
    data: { readAt: new Date() },
  });
}

// 모든 알림 읽음 처리
export async function markAllRead(userId: number) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
