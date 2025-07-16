import { Router } from "express";

import articleRouter from "./article.route";
import authRouter from "./auth.route";
import commentRouter from "./comment.route";
import mypageRouter from "./mypage.route";
import productRouter from "./product.route";

const router = Router();

// 도메인별 라우터 등록
router.use("/articles", articleRouter);
router.use("/auth", authRouter);
router.use("/", commentRouter);
router.use("/mypage", mypageRouter);
router.use("/products", productRouter);

export default router;
