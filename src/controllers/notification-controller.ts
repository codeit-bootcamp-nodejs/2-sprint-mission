import { NextFunction, Request, Response } from "express";
import { notificationService } from "../service/notification-service";


class NotificationController {
  async getMyNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user.id);
      const notification = await notificationService.getMyNotification(userId);
      res.status(200).json({ notification });
    } catch (err) {
      next(err)
    }
  };

  async getMyNotReadNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user.id);
      const notReadCount = await notificationService.getMyNotReadNotification(userId);
      res.status(200).json({ notReadCount })

    } catch (err) {
      next(err)
    }
  };

  async changeMyReadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user.id);
      const notificationId = Number(req.params.id);
      const isRead = Boolean(req.body.isRead);
      const changeIsRead = await notificationService.changeIsReadStatus(userId, notificationId, { isRead });
      res.status(200).json({ changeIsRead })

    } catch (err) {
      next(err)
    }
  };



}

export default new NotificationController();