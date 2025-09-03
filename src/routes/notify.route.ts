import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";

import notifyController from "../controllers/notify.controller";

const router = Router();

// 알림 리스트 조회
router.get("/", verifyAccessToken, notifyController.notifyList);

// 읽지 않은 알림 갯수
router.get("/unread-count", verifyAccessToken, notifyController.unreadCount);

// 읽음 처리 
router.patch("/read-marked", verifyAccessToken, notifyController.readMarked);

export default router;
    