import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getUserInfo,
  updateUserInfo,
  changeUserPassword,
  getMyProducts,
} from "../controllers/user.controller.js";

const router = Router();

// 내 정보 조회, 수정
router.route("/me").get(authenticate, getUserInfo);
router.route("/me").patch(authenticate, updateUserInfo);

// 비밀번호 변경
router.route("/me/password").patch(authenticate, changeUserPassword);

// 내 상품 조회
router.route("/list/products").get(authenticate, getMyProducts);

export default router;
