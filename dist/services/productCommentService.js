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
exports.ProductCommentService = void 0;
class ProductCommentService {
    constructor(io, userRepository, productRepository, productCommentRepository) {
        this.io = io;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productCommentRepository = productCommentRepository;
    }
    createProductComment(userId, productId, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const product = yield this.productRepository.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            if (!commentData.content || commentData.content.trim().length === 0) {
                throw new Error("Comment content cannot be empty.");
            }
            const createData = {
                content: commentData.content,
                user: {
                    connect: { id: userId },
                },
                product: {
                    connect: { id: productId },
                },
            };
            const newProductComment = yield this.productCommentRepository.create(createData);
            return Object.assign({}, newProductComment);
        });
    }
    updateProductComment(userId, productCommentId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const productComment = yield this.productCommentRepository.findById(productCommentId);
            if (!productComment) {
                throw new Error("Product comment not found");
            }
            if (productComment.userId !== userId) {
                throw new Error("Unauthorized to update this product comment");
            }
            const productCommentUpdateData = {
                content: updateData.content,
            };
            const updateProductComment = yield this.productCommentRepository.update(productCommentId, productCommentUpdateData);
            return Object.assign({}, updateProductComment);
        });
    }
    deleteProductComment(userId, productCommentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productComment = yield this.productCommentRepository.findById(productCommentId);
            if (!productComment) {
                throw new Error("Product comment not found");
            }
            if (productComment.userId !== userId) {
                throw new Error("You are not authorized to delete this product comment.");
            }
            yield this.productCommentRepository.delete(productCommentId);
            return { message: "Product comment deleted successfully" };
        });
    }
}
exports.ProductCommentService = ProductCommentService;
