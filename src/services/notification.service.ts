import NotificationRepository from "../repositories/notification.repository";

export default class NotificationService {
  /* POST 알림 생성 */
  static async postNotification(userId: number, message: string, type?: string) {
    return await NotificationRepository.postNotification(userId, message, type);
  }
  /* GET 알림 목록 조회 */
  static async getNotifications(userId: number) {
    return await NotificationRepository.getNotifications(userId);
  }

  /* GET 안 읽은 알림 목록 조회 */
  static async getUnreadNotifications(userId: number) {
    return await NotificationRepository.getUnreadNotifications(userId);
  }

  /* PATCH 알림 읽음 처리 */
  static async patchNotification(id: number, userId: number) {
    return await NotificationRepository.patchNotification(id, userId);
  }
}
