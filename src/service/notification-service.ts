import { notificationRepository } from "../repository/notification-repository";
import { getIO } from "../socket";

export interface ChangeNotificationStatus {
  isRead: boolean;
}


export const notificationService = {
  async sendNotification(userId: number, type: string, message: string) {
    const notification = await notificationRepository.create({
      userId,
      type,
      message,
      isRead: false,
    });
    const io = getIO();
    io.to(`user_${userId}`).emit("notification:new", notification);
    return notification;



  },


  async getMyNotification(userId: number) {
    return notificationRepository.findByUserId(userId);
  },

  async getMyNotReadNotification(userId: number) {
    return notificationRepository.getNotReadNotification(userId);
  },

  async changeIsReadStatus(userId: number, notificationId: number, data: ChangeNotificationStatus) {
    return notificationRepository.changeMyIsReadStatus(userId, notificationId, data)
  }

}