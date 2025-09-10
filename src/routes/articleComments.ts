import { Router } from "express";
import passport from "../lib/passport/index";
import { validateDto } from "../middleware/validator";
import { CommentDto } from "../dtos/comments.dto";
import { ArtricleCommentController } from "../controllers/articleCommentController";
import { ArticleCommentService } from "../services/articleCommentService";
import { Server as SocketIOServer } from "socket.io";
import { UserRepository } from "../repositories/userReporitory";
import { ArticleRepository } from "../repositories/articleReporitory";
import prisma from "../lib/prisma";
import { ArticleCommentRepository } from "../repositories/articleCommentRepository";
import { NotificationRepository } from "../repositories/notification";
import { NotificationService } from "../services/notification";
import { Auth } from "../middleware/Auth";

const AtricleCommentRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const userRepository = new UserRepository(prisma);
  const articleRepository = new ArticleRepository(prisma);
  const articleCommentRepository = new ArticleCommentRepository(prisma);
  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new NotificationService(
    io,
    notificationRepository
  );

  const articleCommentService = new ArticleCommentService(
    io,
    userRepository,
    articleRepository,
    articleCommentRepository,
    notificationService
  );
  const articleCommentController = new ArtricleCommentController(
    articleCommentService
  );

  router.post(
    "/:articleId/create",
    Auth,
    validateDto(CommentDto),
    articleCommentController.createArticleComment
  );
  router.patch(
    "/:commentId/update",
    Auth,
    validateDto(CommentDto),
    articleCommentController.updateArticleComment
  );
  router.delete(
    "/:commentId",
    Auth,
    articleCommentController.deleteArticleComment
  );

  return router;
};
export default AtricleCommentRouter;
