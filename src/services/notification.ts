import { Server as SocketIOServer } from "socket.io";
import { NotificationRepository } from "../repositories/notification";
import {
  NotificationCreateDto,
  NotificationOutput,
} from "../dtos/notification.dto";
import { Prisma } from "@prisma/client";

export class NotificationService {
  private io: SocketIOServer;
  private notificationRepository: NotificationRepository;

  constructor(
    io: SocketIOServer,
    notificationRepository: NotificationRepository
  ) {
    this.io = io;
    this.notificationRepository = notificationRepository;
  }

  async createNotification(
    userId: number,
    Ndata: NotificationCreateDto
  ): Promise<NotificationOutput> {
    const data: Prisma.NotificationCreateInput = {
      message: Ndata.message,
      isRead: Ndata.isRead,
      type: Ndata.type,
      user: {
        connect: { id: userId },
      },
    };
    const newNotification = await this.notificationRepository.create(data);

    // DB에 알림 저장 후, 소켓을 통해 알림 생성
    this.io.to(userId.toString()).emit("newNotification", newNotification);
    return { ...newNotification };
  }

  //알림 목록 조회
  async getNotifications(userId: number) {
    return this.notificationRepository.findManyByUserId(userId);
  }

  // 안 읽은 알림 갯수 조회
  async getUnreadCount(userId: number) {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: number) {
    return this.notificationRepository.changeReadStatus(notificationId);
  }
}
