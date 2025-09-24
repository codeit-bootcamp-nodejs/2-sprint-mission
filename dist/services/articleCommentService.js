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
exports.ArticleCommentService = void 0;
class ArticleCommentService {
    constructor(io, userRepository, articleRepository, articleCommentRepository, notificationService) {
        this.io = io;
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.articleCommentRepository = articleCommentRepository;
        this.notificationService = notificationService;
    }
    createArticleComment(userId, articleId, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const article = yield this.articleRepository.findById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }
            if (!commentData.content || commentData.content.trim().length === 0) {
                throw new Error("Comment content cannot be empty.");
            }
            const createData = {
                content: commentData.content,
                user: {
                    connect: { id: userId },
                },
                article: {
                    connect: { id: articleId },
                },
            };
            const newArticleComment = yield this.articleCommentRepository.create(createData);
            if (article.userId !== userId) {
                const notificationMessage = `${user.nickname}님이 게시글에 댓글을 남겼습니다.`;
                yield this.notificationService.createNotification(article.userId, {
                    message: notificationMessage,
                    type: "COMMENT",
                    isRead: false,
                });
            }
            return Object.assign({}, newArticleComment);
        });
    }
    updateArticleComment(userId, articleCommentId, updateComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const articleComment = yield this.articleCommentRepository.findById(articleCommentId);
            if (!articleComment) {
                throw new Error("Article comment not found");
            }
            if (articleComment.userId !== userId) {
                throw new Error("Unauthorized to update this article comment");
            }
            const articleCommentUpdateDate = {
                content: updateComment.content,
            };
            const updateArticleComment = yield this.articleCommentRepository.update(articleCommentId, articleCommentUpdateDate);
            return Object.assign({}, updateArticleComment);
        });
    }
    deleteArticleComment(userId, articleCommentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleComment = yield this.articleCommentRepository.findById(articleCommentId);
            if (!articleComment) {
                throw new Error("Article comment not found");
            }
            if (articleComment.userId !== userId) {
                throw new Error("You are not authorized to delete this article comment.");
            }
            yield this.articleCommentRepository.delete(articleCommentId);
            return { message: "Article comment deleted successfully" };
        });
    }
}
exports.ArticleCommentService = ArticleCommentService;
