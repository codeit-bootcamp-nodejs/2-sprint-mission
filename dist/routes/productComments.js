"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_dto_1 = require("../dtos/comments.dto");
const validator_1 = require("../middleware/validator");
const productCommentService_1 = require("../services/productCommentService");
const productCommentController_1 = require("../controllers/productCommentController");
const userReporitory_1 = require("../repositories/userReporitory");
const prisma_1 = __importDefault(require("../lib/prisma"));
const productRepository_1 = require("../repositories/productRepository");
const productCommentRepository_1 = require("../repositories/productCommentRepository");
const Auth_1 = require("../middleware/Auth");
const ProductCommentRouter = (io) => {
    const router = (0, express_1.Router)();
    const userRepository = new userReporitory_1.UserRepository(prisma_1.default);
    const productRepository = new productRepository_1.ProductRepository(prisma_1.default);
    const productCommentRepository = new productCommentRepository_1.ProductCommentRepository(prisma_1.default);
    const productCommentService = new productCommentService_1.ProductCommentService(io, userRepository, productRepository, productCommentRepository);
    const productCommentController = new productCommentController_1.ProductCommentController(productCommentService);
    router.post("/:productId/create", Auth_1.Auth, (0, validator_1.validateDto)(comments_dto_1.CommentDto), productCommentController.createProductComment);
    router.patch("/:commentId/update", Auth_1.Auth, (0, validator_1.validateDto)(comments_dto_1.CommentDto), productCommentController.updateProductComment);
    router.delete("/:commentId", Auth_1.Auth, productCommentController.deleteProductComment);
    return router;
};
exports.default = ProductCommentRouter;
