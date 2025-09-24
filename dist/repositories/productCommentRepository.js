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
exports.ProductCommentRepository = void 0;
class ProductCommentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productComment.findUnique({
                where: { id },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productComment.create({ data });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productComment.update({
                where: { id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.productComment.delete({
                where: { id },
            });
        });
    }
}
exports.ProductCommentRepository = ProductCommentRepository;
