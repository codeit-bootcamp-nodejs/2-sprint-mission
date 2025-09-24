"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articles_dto_1 = require("../dtos/articles.dto");
const validator_1 = require("../middleware/validator");
const articleService_1 = require("../services/articleService");
const articleController_1 = require("../controllers/articleController");
const articleReporitory_1 = require("../repositories/articleReporitory");
const articleLikeReporitory_1 = require("../repositories/articleLikeReporitory");
const prisma_1 = __importDefault(require("../lib/prisma"));
const optionalAuth_1 = require("../middleware/optionalAuth");
const Auth_1 = require("../middleware/Auth");
const ArticleRouter = () => {
    const router = (0, express_1.Router)();
    const articleReporitory = new articleReporitory_1.ArticleRepository(prisma_1.default);
    const articleLikeReporitory = new articleLikeReporitory_1.ArticleLikeRepository(prisma_1.default);
    const articleService = new articleService_1.ArticleService(articleReporitory, articleLikeReporitory);
    const articleController = new articleController_1.ArticleController(articleService);
    router.post("/create", Auth_1.Auth, (0, validator_1.validateDto)(articles_dto_1.CreateArticlesDto), articleController.createArticle);
    router.patch("/update/:id", Auth_1.Auth, (0, validator_1.validateDto)(articles_dto_1.PatchArticleDto), articleController.updateArticle);
    router.delete("/:id", Auth_1.Auth, articleController.deleteArticle);
    router.get("/my-article", Auth_1.Auth, articleController.getMyArticleList);
    router.get("/", optionalAuth_1.optionalAuth, articleController.getArticleList);
    return router;
};
exports.default = ArticleRouter;
