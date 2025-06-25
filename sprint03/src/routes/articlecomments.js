import { Router } from "express";

import {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment,
} from "../controllers/article.comment.controller.js";

const router = Router();

router.route("/:articletId").get(getArticleComments).post(createArticleComment);

router
  .route("/:articleId/:commentId")
  .patch(updateArticleComment)
  .delete(deleteArticleComment);

export default router;
