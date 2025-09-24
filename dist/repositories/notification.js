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
exports.NotificationRepository = void 0;
class NotificationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.notification.create({
                data,
            });
        });
    }
    findManyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    countUnreadByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.notification.count({
                where: { userId, isRead: false },
            });
        });
    }
    changeReadStatus(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true },
            });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
