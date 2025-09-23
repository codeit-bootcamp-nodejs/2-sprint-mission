import express, { NextFunction, Request, Response } from "express";

import likeRouter from "./like.router";
import commentRouter from "./comment.router";
import { withAsync } from "../utils/error";
import authenticate from "../middlewares/authenticate";
import { validateArticle, validateParamId } from "../middlewares/validators";
import ArticleController from "../controllers/article.controller";

const router = express.Router();

router.route("/")
  .get(withAsync(ArticleController.getArticle))
  .post(authenticate, validateArticle, withAsync(ArticleController.postArticle));

router.route("/:id")
  .all(validateParamId)
  .get(withAsync(ArticleController.getArticleById))
  .patch(authenticate, withAsync(ArticleController.patchArticle))
  .delete(authenticate, withAsync(ArticleController.deleteArticle));

// article 관련 comment router
router.use(
  "/:id/comments",
  validateParamId,
  (req: Request, res: Response, next: NextFunction) => { req.relationType = "articles"; next(); },
  commentRouter
);

// article 관련 like router
router.use(
  "/:id/like",
  validateParamId,
  (req: Request, res: Response, next: NextFunction) => { req.relationType = "articles"; next(); },
  likeRouter
);

export default router;
