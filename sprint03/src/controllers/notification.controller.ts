import { notificationService } from "../services/notification.service";
import HttpError from "../types/httpError";
import { RequestHandler } from "express";


const getNotifications: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = req.user.id;
    const result = await notificationService.getNotifications(userId);
    res.json(result);

  } catch (err) {
    next(err);
  };
}

const getUnreadCount: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (err) {
    next(err);
  };
};

 const readNotification: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await notificationService.readNotification(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  };
};

export {
  getNotifications,
  getUnreadCount,
  readNotification,
};
