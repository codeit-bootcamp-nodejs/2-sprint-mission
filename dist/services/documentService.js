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
exports.DocumentService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class DocumentService {
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }
    getDocument(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.documentRepository.findById(id);
            if (!document) {
                throw new Error("Document not found");
            }
            const filePath = path_1.default.join(__dirname, "../", "../", "uploads", document.filename);
            if (!fs_1.default.existsSync(filePath)) {
                console.error(`File not found on disk: ${filePath}`);
                throw new Error("File data mismatch: File not found on server.");
            }
            return {
                filePath: filePath,
                filename: document.filename,
                mimetype: document.mimetype,
            };
        });
    }
    createDocument(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createData = {
                filename: data.filename,
                mimetype: data.mimetype,
                size: data.size,
                url: data.url,
            };
            const newDocument = yield this.documentRepository.create(createData);
            return newDocument;
        });
    }
    deleteDocument(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.documentRepository.findById(id);
            if (!document) {
                throw new Error("Document not found");
            }
            const filePath = path_1.default.join(__dirname, "../", "../", "uploads", document.filename);
            if (fs_1.default.existsSync(filePath)) {
                try {
                    yield fs_1.default.promises.unlink(filePath);
                    console.log(`File successfully deleted from filesystem: ${filePath}`);
                }
                catch (fileDeleteError) {
                    console.error(`Error deleting file from disk: ${filePath}`, fileDeleteError);
                    throw new Error("Failed to delete file from server storage.");
                }
            }
            else {
                console.warn(`Attempted to delete document record, but file not found on disk: ${filePath}. Proceeding with DB record deletion.`);
            }
            const deletedDocument = yield this.documentRepository.delete(id);
            return {
                message: "Document deleted successfully",
                deletedId: deletedDocument,
            };
        });
    }
}
exports.DocumentService = DocumentService;
