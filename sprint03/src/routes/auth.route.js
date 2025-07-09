import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

const router = Router();

// 회원가입
router.route("/register").post(register);

// 로그인
router.route("/login").post(login);

// 토큰 재 발급
router.route("/refresh").post(refreshAccessToken);

export default router;
