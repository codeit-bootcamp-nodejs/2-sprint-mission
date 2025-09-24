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
exports.ArticleRepository = void 0;
class ArticleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.findUnique({
                where: { id },
            });
        });
    }
    findManyArticles(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.findMany({
                skip: options === null || options === void 0 ? void 0 : options.skip,
                take: options === null || options === void 0 ? void 0 : options.take,
                orderBy: options === null || options === void 0 ? void 0 : options.orderBy,
            });
        });
    }
    findManyByUserId(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.findMany({
                where: { userId },
                skip: options === null || options === void 0 ? void 0 : options.skip,
                take: options === null || options === void 0 ? void 0 : options.take,
                orderBy: options === null || options === void 0 ? void 0 : options.orderBy,
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.update({
                where: { id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.delete({
                where: { id },
            });
        });
    }
    updateLikeIncrease(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.update({
                where: { id },
                data: {
                    likeCount: { increment: 1 },
                },
                select: {
                    likeCount: true,
                },
            });
        });
    }
    updateLikeDecrease(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.article.update({
                where: { id },
                data: {
                    likeCount: { decrement: 1 },
                },
                select: { likeCount: true },
            });
        });
    }
}
exports.ArticleRepository = ArticleRepository;
