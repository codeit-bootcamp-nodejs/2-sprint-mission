import { RequestHandler, Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";
import { validateBody } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../types/zodSchema/auth.schema"
import authController from "../controllers/auth.controller";

const router = Router();

// 회원가입
router.post("/register", validateBody(registerSchema), authController.register);

// 로그인
router.post("/login", validateBody(loginSchema), authController.login);

// 로그아웃
router.post("/logout", verifyAccessToken, authController.logout);

// 토큰 재발급
// passport 인증없이 사용 가능한 이유는? RefreshToken을 직접 쿠키에서 꺼내서 검증하는 방식이기 때문!
router.post("/refresh", authController.reissueAccessToken as RequestHandler);

export default router;
