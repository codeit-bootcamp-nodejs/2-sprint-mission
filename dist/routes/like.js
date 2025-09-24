"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeService_1 = require("../services/likeService");
const likeController_1 = require("../controllers/likeController");
const prisma_1 = __importDefault(require("../lib/prisma"));
const userReporitory_1 = require("../repositories/userReporitory");
const productRepository_1 = require("../repositories/productRepository");
const productLikeRepository_1 = require("../repositories/productLikeRepository");
const articleReporitory_1 = require("../repositories/articleReporitory");
const articleLikeReporitory_1 = require("../repositories/articleLikeReporitory");
const Auth_1 = require("../middleware/Auth");
const LikeRouter = (io) => {
    const router = (0, express_1.Router)();
    const userRepository = new userReporitory_1.UserRepository(prisma_1.default);
    const productRepository = new productRepository_1.ProductRepository(prisma_1.default);
    const productLikeRepository = new productLikeRepository_1.ProductLikeRepository(prisma_1.default);
    const articleReporitory = new articleReporitory_1.ArticleRepository(prisma_1.default);
    const articleLikeRepository = new articleLikeReporitory_1.ArticleLikeRepository(prisma_1.default);
    const likeService = new likeService_1.LikeService(io, userRepository, productRepository, productLikeRepository, articleReporitory, articleLikeRepository);
    const likeController = new likeController_1.LikeController(likeService);
    router.post("/products/:productId", Auth_1.Auth, likeController.uploadLikeProduct);
    router.post("/articles/:articleId", Auth_1.Auth, likeController.uploadLikeArticle);
    return router;
};
exports.default = LikeRouter;
