import express, { Router } from "express";
const router = express.Router();
import passport from "../lib/passport/index";
import { Server as SocketIOServer } from "socket.io";
import { CreateProductDto, PatchProductDto } from "../dtos/products.dto";
import { validateDto } from "../middleware/validator";
import { ProductService } from "../services/productService";
import { ProductController } from "../controllers/productController";
import { ProductRepository } from "../repositories/productRepository";
import prisma from "../lib/prisma";
import { ProductLikeRepository } from "../repositories/productLikeRepository";
import { NotificationRepository } from "../repositories/notification";
import { NotificationService } from "../services/notification";
import { optionalAuth } from "../middleware/optionalAuth";
import { Auth } from "../middleware/Auth";

const ProductRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const productRepository = new ProductRepository(prisma);
  const productLikeRepository = new ProductLikeRepository(prisma);
  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new NotificationService(
    io,
    notificationRepository
  );

  const productService = new ProductService(
    io,
    productRepository,
    productLikeRepository,
    notificationService
  );
  const productController = new ProductController(productService);

  router.post(
    "/create",
    Auth,
    validateDto(CreateProductDto),
    productController.createProduct
  );
  router.patch(
    "/update/:id",
    Auth,
    validateDto(PatchProductDto),
    productController.updateProduct
  );
  router.delete(
    "/:id",
    Auth,
    productController.deleteProduct
  );
  router.get(
    "/my-product",
    Auth,
    productController.getMyProductList
  );
  router.get(
    "/",
    optionalAuth,
    productController.getProductList
  );
  router.get(
    "/me/liked-products",
    Auth,
    productController.getLikedProductList
  );
  return router;
};

export default ProductRouter;
