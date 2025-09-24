"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const products_dto_1 = require("../dtos/products.dto");
const class_transformer_1 = require("class-transformer");
class ProductController {
    constructor(productService) {
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const productData = (0, class_transformer_1.plainToInstance)(products_dto_1.CreateProductDto, req.body);
                const userId = req.user.id;
                const newProduct = yield this.productService.createProduct(userId, productData);
                res
                    .status(201)
                    .json({ message: "Product created successfully", product: newProduct });
            }
            catch (error) {
                console.error("Failed to create product:", error);
                next(error);
            }
        });
        this.updateProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const productId = Number(req.params.id);
                const user = req.user.id;
                const updateData = (0, class_transformer_1.plainToInstance)(products_dto_1.PatchProductDto, req.body);
                const updatedProduct = yield this.productService.updateProduct(user, productId, updateData);
                res.status(200).json({
                    message: "Product updated successfully",
                    product: updatedProduct,
                });
            }
            catch (error) {
                console.error("Failed to update product:", error);
                next(error);
            }
        });
        this.deleteProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const productId = Number(req.params.id);
                const user = req.user.id;
                yield this.productService.deleteProduct(user, productId);
                res.status(204).send();
            }
            catch (error) {
                console.error("Failed to delete product:", error);
                next(error);
            }
        });
        this.getMyProductList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = req.user.id;
                const offset = req.query.offset
                    ? parseInt(req.query.offset, 10)
                    : 0;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 10;
                const order = req.query.order || "newest";
                const products = yield this.productService.myProducts(user, {
                    offset,
                    limit,
                    order,
                });
                res.status(200).json(products);
            }
            catch (error) {
                console.error(`Error fetching user's products:`, error);
                next(error);
            }
        });
        this.getProductList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user ? req.user.id : null;
                const offset = req.query.offset
                    ? parseInt(req.query.offset, 10)
                    : 0;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 10;
                const order = req.query.order || "newest";
                const products = yield this.productService.getProductList(user, {
                    offset,
                    limit,
                    order,
                });
                return res.status(200).json(products);
            }
            catch (error) {
                console.error("Error fetching product list with like status:", error);
                next(error);
            }
        });
        this.getLikedProductList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const userId = req.user.id;
                const offset = req.query.offset
                    ? parseInt(req.query.offset, 10)
                    : 0;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 10;
                const order = req.query.order || "newest";
                const products = yield this.productService.myProductsLiked(userId, {
                    offset,
                    limit,
                    order,
                });
                res.status(200).json(products);
            }
            catch (error) {
                console.error("Error fetching products:", error);
                next(error);
            }
        });
        this.productService = productService;
    }
}
exports.ProductController = ProductController;
