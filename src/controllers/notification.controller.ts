import { Request, Response } from "express";
import notificationService from "../services/notification.service";

const notificationController = {
  // 알림 리스트 조회
  list: async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);
    const isReadParam = req.query.isRead;
    const isRead =
      typeof isReadParam === "string" ? isReadParam === "true" : undefined;

    const data = await notificationService.list(userId, { page, size, isRead });
    res.json({ data });
  },

  // 미읽음 갯수
  unreadCount: async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const count = await notificationService.unreadCount(userId);
    res.json({ data: { count } });
  },

  // 읽음 처리
  read: async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const { ids, all }: { ids?: number[]; all?: boolean } = req.body ?? {};
    await notificationService.read(userId, { ids, all });
    res.status(204).send();
  },
};

export default notificationController;
