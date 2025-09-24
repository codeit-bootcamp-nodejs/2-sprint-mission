"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("../middleware/upload"));
const documentService_1 = require("../services/documentService");
const documentController_1 = require("../controllers/documentController");
const documentRepository_1 = require("../repositories/documentRepository");
const prisma_1 = __importDefault(require("../lib/prisma"));
const DocumentRouter = () => {
    const router = (0, express_1.Router)();
    const documentRepository = new documentRepository_1.DocumentRepository(prisma_1.default);
    const documentService = new documentService_1.DocumentService(documentRepository);
    const documentController = new documentController_1.DocumentController(documentService);
    router.get("/download/:id", documentController.getDocument);
    router.post("/upload", upload_1.default.single("file"), documentController.createDocument);
    router.delete("/:id", documentController.deleteDocument);
    return router;
};
exports.default = DocumentRouter;
