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
exports.ArticleService = void 0;
class ArticleService {
    constructor(articleRepository, articleLikeRepository) {
        this.articleRepository = articleRepository;
        this.articleLikeRepository = articleLikeRepository;
    }
    createArticle(userId, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const createData = {
                title: articleData.title,
                content: articleData.content,
                user: {
                    connect: { id: userId },
                },
            };
            const newArticle = yield this.articleRepository.create(createData);
            return Object.assign({}, newArticle);
        });
    }
    updateArticle(articleId, userId, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articleRepository.findById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }
            if (article.userId !== userId) {
                throw new Error("Unauthorized to update this article");
            }
            const articleUpdateData = {
                title: articleData.title,
                content: articleData.content,
            };
            const updatedArticle = yield this.articleRepository.update(articleId, articleUpdateData);
            if (!updatedArticle) {
                throw new Error("Article update failed");
            }
            return Object.assign({}, updatedArticle);
        });
    }
    deleteArticle(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articleRepository.findById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }
            if (article.userId !== userId) {
                throw new Error("Unauthorized to delete this article");
            }
            yield this.articleRepository.delete(articleId);
            return { message: "Article deleted successfully" };
        });
    }
    myArticles(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderBy;
            switch (options.order) {
                case "oldest":
                    orderBy = { createdAt: "asc" };
                    break;
                case "newest":
                default:
                    orderBy = { createdAt: "desc" };
                    break;
            }
            const myArticles = yield this.articleRepository.findManyByUserId(userId, {
                skip: options.offset,
                take: options.limit,
                orderBy: orderBy,
            });
            return myArticles.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                userId: article.userId,
                likeCount: article.likeCount,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
            }));
        });
    }
    getArticleList(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderBy;
            switch (options.order) {
                case "oldest":
                    orderBy = { createdAt: "asc" };
                    break;
                case "newest":
                default:
                    orderBy = { createdAt: "desc" };
                    break;
            }
            const getArticleList = yield this.articleRepository.findManyArticles({
                skip: options.offset,
                take: options.limit,
                orderBy: orderBy,
            });
            let myLikedArticle = [];
            if (userId) {
                myLikedArticle = yield this.articleLikeRepository.findManyByUserId(userId);
            }
            const likedArticleIds = new Set(myLikedArticle.map((like) => like.articleId));
            const articleWithLikedStatus = getArticleList.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                userId: article.userId,
                likeCount: article.likeCount,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                isLiked: likedArticleIds.has(article.id),
            }));
            return articleWithLikedStatus;
        });
    }
}
exports.ArticleService = ArticleService;
