import express from "express";
import NotificationController from "../controllers/notification.controller";
import { validateParamId } from "../middlewares/validators";
import { withAsync } from "../utils/error";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

/* POST 알림 생성 */
router.post("/", withAsync(NotificationController.postNotification));

/* GET 알림 목록 조회 */
router.get("/", authenticate, withAsync(NotificationController.getNotifications));

/* GET 안 읽은 알람 목록 조회 */
router.get("/unread", authenticate, withAsync(NotificationController.getUnreadNotifications));

/* PATCH 알림 읽음 처리 */
router.patch("/:id", validateParamId, authenticate, withAsync(NotificationController.patchNotification));

export default router;
