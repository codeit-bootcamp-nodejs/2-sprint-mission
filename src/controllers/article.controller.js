
const articleService = require('../services/article.service');

exports.getAllArticles = async (req, res, next) => {
    try {
        const result = await articleService.getAllArticles(req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getArticleById = async (req, res, next) => {
    try {
        const result = await articleService.getArticleById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.createArticle = async (req, res, next) => {
    try {
        const result = await articleService.createArticle(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateArticle = async (req, res, next) => {
    try {
        const result = await articleService.updateArticle(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteArticle = async (req, res, next) => {
    try {
        const result = await articleService.deleteArticle(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};