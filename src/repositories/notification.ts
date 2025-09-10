import { Prisma, PrismaClient } from "@prisma/client";

export class NotificationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //알림 생성
  async create(data: Prisma.NotificationCreateInput) {
    return this.prisma.notification.create({
      data,
    });
  }

  // 모든 알림 조회
  async findManyByUserId(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // 안 읽은 알림 개수 조회
  async countUnreadByUserId(userId: number) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // 알림 읽음 처리
  async changeReadStatus(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
