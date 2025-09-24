"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_1 = require("../repositories/notification");
const prisma_1 = __importDefault(require("../lib/prisma"));
const notification_2 = require("../services/notification");
const notificationController_1 = require("../controllers/notificationController");
const Auth_1 = require("../middleware/Auth");
const NotificationsRouter = (io) => {
    const router = (0, express_1.Router)();
    const notificationRepository = new notification_1.NotificationRepository(prisma_1.default);
    const notificationService = new notification_2.NotificationService(io, notificationRepository);
    const notificationController = new notificationController_1.NotificationController(notificationService);
    router.get("/", Auth_1.Auth, notificationController.getNotifications);
    router.get("/unread-noti-count", Auth_1.Auth, notificationController.getUnreadCount);
    router.patch("/:notificationId", Auth_1.Auth, notificationController.markAsRead);
    return router;
};
exports.default = NotificationsRouter;
