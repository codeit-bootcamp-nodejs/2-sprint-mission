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
exports.ProductCommentController = void 0;
const comments_dto_1 = require("../dtos/comments.dto");
const class_transformer_1 = require("class-transformer");
class ProductCommentController {
    constructor(productCommentService) {
        this.createProductComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = req.user.id;
                const productId = Number(req.params.productId);
                const commentData = (0, class_transformer_1.plainToInstance)(comments_dto_1.CommentDto, req.body);
                const newProductComment = yield this.productCommentService.createProductComment(user, productId, commentData);
                res.status(201).json(newProductComment);
            }
            catch (error) {
                console.error("Failed to create product comment:", error);
                next(error);
            }
        });
        this.updateProductComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = req.user.id;
                const commentId = Number(req.params.commentId);
                const commentData = (0, class_transformer_1.plainToInstance)(comments_dto_1.CommentDto, req.body);
                const updatedProductComment = yield this.productCommentService.updateProductComment(user, commentId, commentData);
                res.status(200).json(updatedProductComment);
            }
            catch (error) {
                console.error("Failed to update product comment:", error);
                next(error);
            }
        });
        this.deleteProductComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const commentId = Number(req.params.commentId);
                const user = req.user.id;
                yield this.productCommentService.deleteProductComment(user, commentId);
                res.status(204).send();
            }
            catch (error) {
                console.error("Failed to delete product comment:", error);
                next(error);
            }
        });
        this.productCommentService = productCommentService;
    }
}
exports.ProductCommentController = ProductCommentController;
