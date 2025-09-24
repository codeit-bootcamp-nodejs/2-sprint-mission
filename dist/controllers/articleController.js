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
exports.ArticleController = void 0;
const class_transformer_1 = require("class-transformer");
const articles_dto_1 = require("../dtos/articles.dto");
class ArticleController {
    constructor(articleService) {
        this.createArticle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const articleData = (0, class_transformer_1.plainToInstance)(articles_dto_1.CreateArticlesDto, req.body);
                const userId = req.user.id;
                const newArticle = yield this.articleService.createArticle(userId, articleData);
                res
                    .status(201)
                    .json({ message: "Article created successfully", article: newArticle });
            }
            catch (error) {
                console.error("Failed to create article:", error);
                next(error);
            }
        });
        this.updateArticle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const articleId = Number(req.params.id);
                const user = req.user.id;
                const updateData = (0, class_transformer_1.plainToInstance)(articles_dto_1.PatchArticleDto, req.body);
                const updatedArticle = yield this.articleService.updateArticle(articleId, user, updateData);
                res.status(200).json({
                    message: "Article updated successfully!",
                    article: updatedArticle,
                });
            }
            catch (error) {
                console.error("Error updating article:", error);
                next(error);
            }
        });
        this.deleteArticle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const articleId = Number(req.params.id);
                const user = req.user.id;
                yield this.articleService.deleteArticle(user, articleId);
                res.status(204).send();
            }
            catch (error) {
                console.error("Failed to delete article:", error);
                next(error);
            }
        });
        this.getMyArticleList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = req.user.id;
                const offset = req.query.offset
                    ? parseInt(req.query.offset, 10)
                    : 0;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 10;
                const order = req.query.order || "newest";
                const articles = yield this.articleService.myArticles(user, {
                    offset,
                    limit,
                    order,
                });
                res.status(200).json(articles);
            }
            catch (error) {
                console.error(`Error fetching user's articles:`, error);
                next(error);
            }
        });
        this.getArticleList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user ? req.user.id : null;
                const offset = req.query.offset
                    ? parseInt(req.query.offset, 10)
                    : 0;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 10;
                const order = req.query.order || "newest";
                const articles = yield this.articleService.getArticleList(user, {
                    offset,
                    limit,
                    order,
                });
                res.status(200).json(articles);
            }
            catch (error) {
                console.error("Error fetching article list with like status:", error);
                next(error);
            }
        });
        this.articleService = articleService;
    }
}
exports.ArticleController = ArticleController;
