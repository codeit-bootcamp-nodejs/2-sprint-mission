import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  getUserInfo,
  updateUserInfo,
  changeUserPassword,
  getMyProducts,
  getMyProductsLike,
} from "../controllers/user.controller";

const router = Router();

// 내 정보 조회, 수정
router.route("/me").get(authenticate, getUserInfo);
router.route("/me").patch(authenticate, updateUserInfo);

// 비밀번호 변경
router.route("/me/password").patch(authenticate, changeUserPassword);

// 내 상품 조회
router.route("/list/products").get(authenticate, getMyProducts);

// 내 좋아요 상품 조회
router.route("/list/productsLike").get(authenticate, getMyProductsLike);

export default router;
