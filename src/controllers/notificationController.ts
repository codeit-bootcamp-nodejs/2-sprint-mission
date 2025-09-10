import { plainToInstance } from "class-transformer";
import { NotificationService } from "../services/notification";
import { NextFunction, Request, Response } from "express";
import { NotificationCreateDto } from "../dtos/notification.dto";

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  createNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const notiData = plainToInstance(NotificationCreateDto, req.body);
      const userId = req.user.id;

      const newNoti = await this.notificationService.createNotification(
        userId,
        notiData
      );
      res.status(201).json({ message: "Notification created successfully" });
    } catch (error) {
      console.error("Failed to create notification", error);
      next(error);
    }
  };

  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;
      const notis = await this.notificationService.getNotifications(userId);
      res.status(200).json(notis);
    } catch (error) {
      console.error("Failed to get notifications");
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const count = await this.notificationService.getUnreadCount(userId);
      res.status(200).json({ count });
    } catch (error) {
      console.error("Failed to count notification", error);
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const notificationId = parseInt(req.params.notificationId);
      if (isNaN(notificationId)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      const updatedNotification = await this.notificationService.markAsRead(
        notificationId
      );
      res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("Failed to update noti as read", error);
      next(error);
    }
  };
}
