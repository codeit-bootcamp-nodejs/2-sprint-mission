import express from "express";

import authRouter from "./auth.router";
import usersRouter from "./users.router";
import articlesRouter from "./article.router";
import productsRouter from "./product.router";
import fileRouter from "./file.router";
import notificationRouter from "./notification.router";
import uploadRouter from "./upload.router";

const router = express.Router();

/* GET Health check */
router.get("/", (req, res, next) => { res.send("OK"); });
/* auth 관련 라우터 */
router.use("/auth", authRouter);
/* users 관련 라우터 */
router.use("/users", usersRouter);
/* articles 관련 라우터 */
router.use("/articles", articlesRouter);
/* products 관련 라우터 */
router.use("/products", productsRouter);
/* files 관련 라우터 */
router.use("/files", fileRouter);
/* notifications 관련 라우터 */
router.use("/notifications", notificationRouter);
/* uploads 관련 라우터 */
router.use("/upload", uploadRouter);

export default router;
