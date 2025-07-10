import { Router } from "express";
import mypageController from "../controllers/mypage.controller";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";
import { validateBody } from "../middlewares/validation.middleware";
import {
  updateMyInfoSchema,
  updateMyPasswordSchema,
} from "../types/zodSchema/mypage.schema"

const router = Router();

// 내 정보 조회
router.get("/info", verifyAccessToken, mypageController.getMyInfo);
router.put(
  "/info",
  verifyAccessToken,
  validateBody(updateMyInfoSchema),
  mypageController.updateMyInfo
);

// 내 정보 수정
router.put(
  "/info/pw",
  verifyAccessToken,
  validateBody(updateMyPasswordSchema),
  mypageController.updatePassword
);

// 내가 작성한 상품 조회 
router.get("/list/products", verifyAccessToken, mypageController.getMyProcuts);

// 내가 작성한 게시글 조회
router.get("/list/articles", verifyAccessToken, mypageController.getMyArticles);

// 내가 작성한 댓글 조회
router.get("/list/comments", verifyAccessToken, mypageController.getMyComments);

// 좋아요 한 상품
router.get(
  "/likes/products",
  verifyAccessToken,
  mypageController.getMyLikedProducts
);

// 좋아요 한 게시글
router.get(
  "/likes/articles",
  verifyAccessToken,
  mypageController.getMyLikedArticles
);

export default router;
