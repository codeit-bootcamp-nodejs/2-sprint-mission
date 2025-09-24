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
exports.NotificationService = void 0;
class NotificationService {
    constructor(io, notificationRepository) {
        this.io = io;
        this.notificationRepository = notificationRepository;
    }
    createNotification(userId, Ndata) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                message: Ndata.message,
                isRead: Ndata.isRead,
                type: Ndata.type,
                user: {
                    connect: { id: userId },
                },
            };
            const newNotification = yield this.notificationRepository.create(data);
            this.io.to(userId.toString()).emit("newNotification", newNotification);
            return Object.assign({}, newNotification);
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationRepository.findManyByUserId(userId);
        });
    }
    getUnreadCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationRepository.countUnreadByUserId(userId);
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationRepository.changeReadStatus(notificationId);
        });
    }
}
exports.NotificationService = NotificationService;
