import { Router } from "express";
import passport from "../lib/passport/index";
import { CreateArticlesDto, PatchArticleDto } from "../dtos/articles.dto";
import { validateDto } from "../middleware/validator";
import { ArticleService } from "../services/articleService";
import { ArticleController } from "../controllers/articleController";
import { ArticleRepository } from "../repositories/articleReporitory";
import { ArticleLikeRepository } from "../repositories/articleLikeReporitory";
import prisma from "../lib/prisma";
import { optionalAuth } from "../middleware/optionalAuth";
import { Auth } from "../middleware/Auth";

const ArticleRouter = (): Router => {
  const router = Router();

  const articleReporitory = new ArticleRepository(prisma);
  const articleLikeReporitory = new ArticleLikeRepository(prisma);

  const articleService = new ArticleService(
    articleReporitory,
    articleLikeReporitory
  );
  const articleController = new ArticleController(articleService);

  router.post(
    "/create",
    Auth,
    validateDto(CreateArticlesDto),
    articleController.createArticle
  );
  router.patch(
    "/update/:id",
    Auth,
    validateDto(PatchArticleDto),
    articleController.updateArticle
  );
  router.delete(
    "/:id",
    Auth,
    articleController.deleteArticle
  );
  router.get(
    "/my-article",
    Auth,
    articleController.getMyArticleList
  );
  router.get(
    "/",
    optionalAuth,
    articleController.getArticleList
  );

  return router;
};

export default ArticleRouter;
