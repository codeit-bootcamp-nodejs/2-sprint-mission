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
exports.LikeService = void 0;
const socket_1 = require("../lib/socket");
class LikeService {
    constructor(io, userRepository, productRepository, productLikeRepository, articleRepository, articleLikeRepository) {
        this.io = io;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productLikeRepository = productLikeRepository;
        this.articleRepository = articleRepository;
        this.articleLikeRepository = articleLikeRepository;
    }
    updateProductLike(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const product = yield this.productRepository.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            const existingLike = yield this.productLikeRepository.checkingProductLikeStatus(userId, productId);
            let message;
            let isLiked;
            let likeCount;
            const userSocketId = socket_1.userSocketMap.get(userId.toString());
            const userSocket = userSocketId
                ? this.io.sockets.sockets.get(userSocketId)
                : null;
            if (existingLike) {
                yield this.productLikeRepository.deleteProductLike(existingLike.id);
                const updatedProduct = yield this.productRepository.updateLikeDecrease(productId);
                message = "Product unliked successfully";
                isLiked = false;
                likeCount = updatedProduct.likeCount;
                if (userSocket) {
                    userSocket.leave(productId.toString());
                    console.log(`${userId} left product room ${productId}`);
                }
            }
            else {
                yield this.productLikeRepository.uploadProductLike(userId, productId);
                const updatedProduct = yield this.productRepository.updateLikeIncrease(productId);
                message = "Product liked successfully";
                isLiked = true;
                likeCount = updatedProduct.likeCount;
                if (userSocket) {
                    userSocket.join(productId.toString());
                    console.log(`${userId} joined product room ${productId}`);
                }
            }
            return { message, isLiked, likeCount };
        });
    }
    updateArticleLike(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const article = yield this.articleRepository.findById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }
            const existingLike = yield this.articleLikeRepository.checkingArticleLikeStatus(userId, articleId);
            let message;
            let isLiked;
            let likeCount;
            if (existingLike) {
                yield this.articleLikeRepository.deleteArticleLike(existingLike.id);
                const updatedArticle = yield this.articleRepository.updateLikeDecrease(articleId);
                message = "Article unliked successfully";
                isLiked = false;
                likeCount = updatedArticle.likeCount;
            }
            else {
                yield this.articleLikeRepository.uploadArticleLike(userId, articleId);
                const updatedArticle = yield this.articleRepository.updateLikeIncrease(articleId);
                message = "Article liked successfully";
                isLiked = true;
                likeCount = updatedArticle.likeCount;
            }
            return { message, isLiked, likeCount };
        });
    }
}
exports.LikeService = LikeService;
