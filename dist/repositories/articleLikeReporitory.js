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
exports.ArticleLikeRepository = void 0;
class ArticleLikeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findManyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.articleLike.findMany({
                where: {
                    userId,
                },
                select: { articleId: true },
            });
        });
    }
    checkingArticleLikeStatus(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.articleLike.findFirst({
                where: {
                    userId,
                    articleId,
                },
            });
        });
    }
    deleteArticleLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.articleLike.delete({
                where: { id },
            });
        });
    }
    uploadArticleLike(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.articleLike.create({
                data: {
                    userId,
                    articleId,
                },
            });
        });
    }
}
exports.ArticleLikeRepository = ArticleLikeRepository;
