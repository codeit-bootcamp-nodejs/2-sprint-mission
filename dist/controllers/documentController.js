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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
class DocumentController {
    constructor(documentService) {
        this.getDocument = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const document = yield this.documentService.getDocument(id);
                res.download(document.filePath, document.filename, (err) => {
                    if (err) {
                        console.error("Error downloading file:", err);
                    }
                });
            }
            catch (error) {
                console.error("Error fetching documents:", error);
                next(error);
            }
        });
        this.createDocument = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return res.status(400).json("No file uploaded.");
                }
                const fileUrl = `/files/${req.file.filename}`;
                const documentData = {
                    filename: req.file.filename,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    url: fileUrl,
                };
                const file = yield this.documentService.createDocument(documentData);
                res.status(201).json({ url: file.url, fileId: file.id });
            }
            catch (error) {
                console.error("Error uploading file or saving document record:", error);
                if (req.file && fs_1.default.existsSync(req.file.path)) {
                    fs_1.default.unlinkSync(req.file.path);
                    console.warn(`Rolled back uploaded file due to error: ${req.file.path}`);
                }
                next(error);
            }
        });
        this.deleteDocument = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const deleteDocument = yield this.documentService.deleteDocument(id);
                res.status(200).json(deleteDocument);
            }
            catch (error) {
                console.error("Error deleting document:", error);
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2025") {
                        return res.status(404).json({ error: "Document not found" });
                    }
                }
                next(error);
            }
        });
        this.documentService = documentService;
    }
}
exports.DocumentController = DocumentController;
