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
exports.ArtricleCommentController = void 0;
const comments_dto_1 = require("../dtos/comments.dto");
const class_transformer_1 = require("class-transformer");
class ArtricleCommentController {
    constructor(articleCommentService) {
        this.createArticleComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = req.user.id;
                const articleId = Number(req.params.articleId);
                const commentData = (0, class_transformer_1.plainToInstance)(comments_dto_1.CommentDto, req.body);
                const newArticleComment = yield this.articleCommentService.createArticleComment(user, articleId, commentData);
                res.status(201).json(newArticleComment);
            }
            catch (error) {
                console.error('Failed to create article comment:', error);
                next(error);
            }
        });
        this.updateArticleComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = req.user.id;
                const commentId = Number(req.params.commentId);
                const commentData = (0, class_transformer_1.plainToInstance)(comments_dto_1.CommentDto, req.body);
                const updatedComment = yield this.articleCommentService.updateArticleComment(user, commentId, commentData);
                res.status(200).json(updatedComment);
            }
            catch (error) {
                console.error('Failed to update article comment:', error);
                next(error);
            }
        });
        this.deleteArticleComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const commentId = Number(req.params.commentId);
                const user = req.user.id;
                yield this.articleCommentService.deleteArticleComment(user, commentId);
                res.status(204).send();
            }
            catch (error) {
                console.error('Failed to delete article comment:', error);
                next(error);
            }
        });
        this.articleCommentService = articleCommentService;
    }
}
exports.ArtricleCommentController = ArtricleCommentController;
