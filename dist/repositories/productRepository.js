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
exports.ProductRepository = void 0;
class ProductRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.findUnique({
                where: { id },
            });
        });
    }
    findManyProducts(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.findMany({
                skip: options === null || options === void 0 ? void 0 : options.skip,
                take: options === null || options === void 0 ? void 0 : options.take,
                orderBy: options === null || options === void 0 ? void 0 : options.orderBy,
            });
        });
    }
    findManyByUserId(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.findMany({
                where: { userId },
                skip: options === null || options === void 0 ? void 0 : options.skip,
                take: options === null || options === void 0 ? void 0 : options.take,
                orderBy: options === null || options === void 0 ? void 0 : options.orderBy,
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.update({
                where: { id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.delete({
                where: { id },
            });
        });
    }
    updateLikeIncrease(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.product.update({
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
            return this.prisma.product.update({
                where: { id },
                data: {
                    likeCount: { decrement: 1 },
                },
                select: { likeCount: true },
            });
        });
    }
}
exports.ProductRepository = ProductRepository;
