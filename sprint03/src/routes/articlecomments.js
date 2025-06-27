import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeArticleComment } from "../middlewares/authorize.article.comment.js";

import {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment,
} from "../controllers/article.comment.controller.js";

const router = Router();

router
  .route("/:articletId")
  .get(getArticleComments)
  .post(authenticate, createArticleComment);

router
  .route("/:articleId/:commentId")
  .patch(authenticate, authorizeArticleComment, updateArticleComment)
  .delete(authenticate, authorizeArticleComment, deleteArticleComment);

export default router;
