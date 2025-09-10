import { Router } from "express";
import passport from "../lib/passport";
import { Server as SocketIOServer } from "socket.io";
import { LikeService } from "../services/likeService";
import { LikeController } from "../controllers/likeController";
import prisma from "../lib/prisma";
import { UserRepository } from "../repositories/userReporitory";
import { ProductRepository } from "../repositories/productRepository";
import { ProductLikeRepository } from "../repositories/productLikeRepository";
import { ArticleRepository } from "../repositories/articleReporitory";
import { ArticleLikeRepository } from "../repositories/articleLikeReporitory";
import { Auth } from "../middleware/Auth";

const LikeRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const userRepository = new UserRepository(prisma);
  const productRepository = new ProductRepository(prisma);
  const productLikeRepository = new ProductLikeRepository(prisma);
  const articleReporitory = new ArticleRepository(prisma);
  const articleLikeRepository = new ArticleLikeRepository(prisma);

  const likeService = new LikeService(
    io,
    userRepository,
    productRepository,
    productLikeRepository,
    articleReporitory,
    articleLikeRepository
  );
  const likeController = new LikeController(likeService);

  router.post(
    "/products/:productId",
    Auth,
    likeController.uploadLikeProduct
  );
  router.post(
    "/articles/:articleId",
    Auth,
    likeController.uploadLikeArticle
  );

  return router;
};

export default LikeRouter;
