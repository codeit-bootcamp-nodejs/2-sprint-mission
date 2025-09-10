import { Router } from "express";
import { Server as SocketIOServer } from "socket.io";
import { NotificationRepository } from "../repositories/notification";
import prisma from "../lib/prisma";
import { NotificationService } from "../services/notification";
import { NotificationController } from "../controllers/notificationController";
import passport from "../lib/passport/index";
import { Auth } from "../middleware/Auth";

const NotificationsRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new NotificationService(
    io,
    notificationRepository
  );
  const notificationController = new NotificationController(
    notificationService
  );

  router.get(
    "/",
    Auth,
    notificationController.getNotifications
  );

  router.get(
    "/unread-noti-count",
    Auth,
    notificationController.getUnreadCount
  );

  router.patch(
    "/:notificationId",
    Auth,
    notificationController.markAsRead
  );
  return router;
};

export default NotificationsRouter;
