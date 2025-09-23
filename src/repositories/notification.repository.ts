import { db } from "../utils/db";

export default class NotificationRepository {
  /* POST 알림 생성 */
  static async postNotification(userId: number, message: string, type?: string) {
    return await db.notification.create({
      data: { userId, message, isRead: false, type: type || "default" }
    })
  }

  /* GET 알림 목록 조회 */
  static async getNotifications(userId: number) {
    return await db.notification.findMany({
      where: { userId }
    })
  }

  /* GET 안 읽은 알림 목록 조회 */
  static async getUnreadNotifications(userId: number) {
    return await db.notification.findMany({
      where: { userId, isRead: false }
    })
  }

  /* PATCH 알림 읽음 처리 */
  static async patchNotification(id: number, userId: number) {
    return await db.notification.update({
      where: { id, userId },
      data: { isRead: true }
    })
  }
}
