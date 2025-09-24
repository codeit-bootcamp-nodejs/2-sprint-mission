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
exports.ProductLikeRepository = void 0;
class ProductLikeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findManyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productLike.findMany({
                where: {
                    userId,
                },
                select: { productId: true },
            });
        });
    }
    findUsersByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedUsers = yield this.prisma.productLike.findMany({
                where: { productId },
                select: {
                    user: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            return likedUsers.map((entry) => entry.user);
        });
    }
    findLikedProductsByUserId(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productLike.findMany({
                where: {
                    userId,
                },
                skip: options === null || options === void 0 ? void 0 : options.skip,
                take: options === null || options === void 0 ? void 0 : options.take,
                orderBy: options === null || options === void 0 ? void 0 : options.orderBy,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            tags: true,
                            userId: true,
                            likeCount: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });
        });
    }
    checkingProductLikeStatus(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productLike.findFirst({
                where: {
                    userId,
                    productId,
                },
            });
        });
    }
    deleteProductLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productLike.delete({
                where: { id },
            });
        });
    }
    uploadProductLike(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productLike.create({
                data: {
                    userId,
                    productId,
                },
            });
        });
    }
}
exports.ProductLikeRepository = ProductLikeRepository;
