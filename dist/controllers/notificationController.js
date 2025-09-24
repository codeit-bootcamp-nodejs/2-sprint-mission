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
exports.NotificationController = void 0;
const class_transformer_1 = require("class-transformer");
const notification_dto_1 = require("../dtos/notification.dto");
class NotificationController {
    constructor(notificationService) {
        this.createNotification = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const notiData = (0, class_transformer_1.plainToInstance)(notification_dto_1.NotificationCreateDto, req.body);
                const userId = req.user.id;
                const newNoti = yield this.notificationService.createNotification(userId, notiData);
                res.status(201).json({ message: "Notification created successfully" });
            }
            catch (error) {
                console.error("Failed to create notification", error);
                next(error);
            }
        });
        this.getNotifications = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const userId = req.user.id;
                const notis = yield this.notificationService.getNotifications(userId);
                res.status(200).json(notis);
            }
            catch (error) {
                console.error("Failed to get notifications");
                next(error);
            }
        });
        this.getUnreadCount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const userId = req.user.id;
                const count = yield this.notificationService.getUnreadCount(userId);
                res.status(200).json({ count });
            }
            catch (error) {
                console.error("Failed to count notification", error);
                next(error);
            }
        });
        this.markAsRead = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const notificationId = parseInt(req.params.notificationId);
                if (isNaN(notificationId)) {
                    return res.status(400).json({ message: "Invalid notification ID" });
                }
                const updatedNotification = yield this.notificationService.markAsRead(notificationId);
                res.status(200).json(updatedNotification);
            }
            catch (error) {
                console.error("Failed to update noti as read", error);
                next(error);
            }
        });
        this.notificationService = notificationService;
    }
}
exports.NotificationController = NotificationController;
