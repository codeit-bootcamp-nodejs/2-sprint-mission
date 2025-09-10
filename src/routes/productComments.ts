import { Router } from "express";
import passport from "../lib/passport/index";
import { CommentDto } from "../dtos/comments.dto";
import { validateDto } from "../middleware/validator";
import { Server as SocketIOServer } from "socket.io";
import { ProductCommentService } from "../services/productCommentService";
import { ProductCommentController } from "../controllers/productCommentController";
import { UserRepository } from "../repositories/userReporitory";
import prisma from "../lib/prisma";
import { ProductRepository } from "../repositories/productRepository";
import { ProductCommentRepository } from "../repositories/productCommentRepository";
import { Auth } from "../middleware/Auth";

const ProductCommentRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const userRepository = new UserRepository(prisma);
  const productRepository = new ProductRepository(prisma);
  const productCommentRepository = new ProductCommentRepository(prisma);

  const productCommentService = new ProductCommentService(
    io,
    userRepository,
    productRepository,
    productCommentRepository
  );
  const productCommentController = new ProductCommentController(
    productCommentService
  );

  router.post(
    "/:productId/create",
    Auth,
    validateDto(CommentDto),
    productCommentController.createProductComment
  );
  router.patch(
    "/:commentId/update",
    Auth,
    validateDto(CommentDto),
    productCommentController.updateProductComment
  );
  router.delete(
    "/:commentId",
    Auth,
    productCommentController.deleteProductComment
  );

  return router;
};

export default ProductCommentRouter;
