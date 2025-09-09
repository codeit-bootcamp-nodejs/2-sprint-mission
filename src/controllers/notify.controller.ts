import { Request, Response } from "express";
import notifyService from "../services/notify.service";
import { MarkReadBodySchema } from "../types/zodSchema/notify.schema";

const notifyController = {
  // 알림 리스트 조회
  notifyList: async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);
    const isReadParam = req.query.isRead;
    const isRead =
      typeof isReadParam === "string" ? isReadParam === "true" : undefined;

    const data = await notifyService.notifyList(userId, { page, size, isRead });
    res.status(200).json({ data });
  },

  // 읽지 않은 알림 갯수
  unreadCount: async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const count = await notifyService.unreadCount(userId);
    res.status(200).json({ data: { count } });
  },

  // 읽음 처리
  readMarked: async (req: Request, res: Response) => {
    const { ids, all }: { ids?: number[]; all?: boolean } =
      MarkReadBodySchema.parse(req.body);
    const userId = Number(req.user?.id);

    const result = await notifyService.readMarked(userId, { ids, all });

    return res.status(204).send();
  },
};

export default notifyController;
