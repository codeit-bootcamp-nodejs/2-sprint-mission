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
exports.LikeController = void 0;
class LikeController {
    constructor(likeService) {
        this.uploadLikeProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const productId = Number(req.params.productId);
                const user = req.user.id;
                const updateProductLike = yield this.likeService.updateProductLike(user, productId);
                return res.status(200).json(updateProductLike);
            }
            catch (error) {
                console.error('Error in uploadLikeProduct:', error);
                next(error);
            }
        });
        this.uploadLikeArticle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const articleId = Number(req.params.articleId);
                const user = req.user.id;
                const updateArticleLike = yield this.likeService.updateArticleLike(user, articleId);
                return res.status(200).json(updateArticleLike);
            }
            catch (error) {
                console.error('Error in uploadLikeArticle:', error);
                next(error);
            }
        });
        this.likeService = likeService;
    }
}
exports.LikeController = LikeController;
