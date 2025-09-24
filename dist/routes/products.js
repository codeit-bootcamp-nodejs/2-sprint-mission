"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const router = express_1.default.Router();
const products_dto_1 = require("../dtos/products.dto");
const validator_1 = require("../middleware/validator");
const productService_1 = require("../services/productService");
const productController_1 = require("../controllers/productController");
const productRepository_1 = require("../repositories/productRepository");
const prisma_1 = __importDefault(require("../lib/prisma"));
const productLikeRepository_1 = require("../repositories/productLikeRepository");
const notification_1 = require("../repositories/notification");
const notification_2 = require("../services/notification");
const optionalAuth_1 = require("../middleware/optionalAuth");
const Auth_1 = require("../middleware/Auth");
const ProductRouter = (io) => {
    const router = (0, express_1.Router)();
    const productRepository = new productRepository_1.ProductRepository(prisma_1.default);
    const productLikeRepository = new productLikeRepository_1.ProductLikeRepository(prisma_1.default);
    const notificationRepository = new notification_1.NotificationRepository(prisma_1.default);
    const notificationService = new notification_2.NotificationService(io, notificationRepository);
    const productService = new productService_1.ProductService(io, productRepository, productLikeRepository, notificationService);
    const productController = new productController_1.ProductController(productService);
    router.post("/create", Auth_1.Auth, (0, validator_1.validateDto)(products_dto_1.CreateProductDto), productController.createProduct);
    router.patch("/update/:id", Auth_1.Auth, (0, validator_1.validateDto)(products_dto_1.PatchProductDto), productController.updateProduct);
    router.delete("/:id", Auth_1.Auth, productController.deleteProduct);
    router.get("/my-product", Auth_1.Auth, productController.getMyProductList);
    router.get("/", optionalAuth_1.optionalAuth, productController.getProductList);
    router.get("/me/liked-products", Auth_1.Auth, productController.getLikedProductList);
    return router;
};
exports.default = ProductRouter;
