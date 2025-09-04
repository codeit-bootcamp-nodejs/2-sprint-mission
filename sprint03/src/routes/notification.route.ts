import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  readNotification,
} from "../controllers/notification.controller";

const router = Router();

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", readNotification);

export default router;