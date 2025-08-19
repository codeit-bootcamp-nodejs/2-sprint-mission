import { Router } from "express";
import notificationController from "../controllers/notification.controller";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";

const router = Router();

// 알림 리스트 조회
router.get("/", verifyAccessToken, notificationController.list);

// 미읽음 갯수
router.get(
  "/unread-count",
  verifyAccessToken,
  notificationController.unreadCount
);

// 읽음 처리 
router.patch("/read", verifyAccessToken, notificationController.read);

export default router;
