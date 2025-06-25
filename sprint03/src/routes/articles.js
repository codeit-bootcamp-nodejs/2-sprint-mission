import { Router } from "express";

import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
} from "../controllers/article.controller.js";

const router = Router();

router.route("/").get(getArticles).post(createArticle);

router
  .route("/:id")
  .get(getArticleById)
  .patch(updateArticle)
  .delete(deleteArticle);

export default router;
