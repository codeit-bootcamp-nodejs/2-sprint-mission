import { Router } from "express";
import notificationController from "../controllers/notification.controller";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";

const router = Router();

router.get("/", verifyAccessToken, notificationController.list);
router.get(
  "/unread-count",
  verifyAccessToken,
  notificationController.unreadCount
);
router.patch("/read", verifyAccessToken, notificationController.read);

export default router;
