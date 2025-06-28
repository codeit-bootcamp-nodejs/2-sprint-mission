import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeArticle } from "../middlewares/authorize.article.js";

import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
  articleLike,
} from "../controllers/article.controller.js";

const router = Router();

router.route("/").get(getArticles).post(authenticate, createArticle);

router
  .route("/:id")
  .get(getArticleById)
  .patch(authenticate, authorizeArticle, updateArticle)
  .delete(authenticate, authorizeArticle, deleteArticle);

router.route("/:id/like").post(authenticate, articleLike);

export default router;
