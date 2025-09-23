import { Request, Response } from "express";
import NotificationService from "../services/notification.service";
import { AuthenticationError } from "../utils/error";
import { sendNotification } from "../utils/socket";

export default class NotificationController {
  /* POST 알림 생성 */
  static async postNotification(req: Request, res: Response) {
    const userId = req.user ? Number(req.user.id) : null;
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    const { message } = req.body;
    if (!message) throw new Error("알림 메시지가 필요합니다.");

    const notification = await NotificationService.postNotification(userId, message);

    // 소켓을 통해 알림 전송
    sendNotification(userId, notification);

    res.status(201).json(notification);
  }

  /* GET 알림 목록 조회 */
  static async getNotifications(req: Request, res: Response) {
    const userId = req.user ? Number(req.user.id) : null;
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    const notifications = await NotificationService.getNotifications(userId);

    res.json(notifications);
  }

  /* GET 안 읽은 알림 목록 조회 */
  static async getUnreadNotifications(req: Request, res: Response) {
    const userId = req.user ? Number(req.user.id) : null;
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    const notifications = await NotificationService.getUnreadNotifications(userId);

    res.json(notifications.length);
  }

  /* PATCH 알림 읽음 처리 */
  static async patchNotification(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = req.user ? Number(req.user.id) : null;
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    await NotificationService.patchNotification(id, userId);

    res.json("알림 읽음 처리");
  }
}
