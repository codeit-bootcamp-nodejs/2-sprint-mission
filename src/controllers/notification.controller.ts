import { Request, Response } from "express";
import notificationService from "../services/notification.service";

const notificationController = {
  list: async (req: Request, res: Response) => {
    const userId = (req as any).user.id as number;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);
    const isReadParam = req.query.isRead;
    const isRead =
      typeof isReadParam === "string" ? isReadParam === "true" : undefined;

    const data = await notificationService.list(userId, { page, size, isRead });
    res.json({ data });
  },

  unreadCount: async (req: Request, res: Response) => {
    const userId = (req as any).user.id as number;
    const count = await notificationService.unreadCount(userId);
    res.json({ data: { count } });
  },

  read: async (req: Request, res: Response) => {
    const userId = (req as any).user.id as number;
    const { ids, all }: { ids?: number[]; all?: boolean } = req.body ?? {};
    await notificationService.read(userId, { ids, all });
    res.status(204).send();
  },
};

export default notificationController;
