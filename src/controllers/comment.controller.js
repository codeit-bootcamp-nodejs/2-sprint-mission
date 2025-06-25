
const commentService = require('../services/comment.service');

exports.getAllProductComments = async (req, res, next) => {
    try {
        const result = await commentService.getAllProductComments(req.params.productId, req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.createProductComment = async (req, res, next) => {
    try {
        const result = await commentService.createProductComment(req.params.productId, req.body.content);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateProductComment = async (req, res, next) => {
    try {
        const result = await commentService.updateProductComment(req.params.productId, req.params.commentId, req.body.content);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteProductComment = async (req, res, next) => {
    try {
        const result = await commentService.deleteProductComment(req.params.productId, req.params.commentId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getAllArticleComments = async (req, res, next) => {
    try {
        const result = await commentService.getAllArticleComments(req.params.articleId, req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.createArticleComment = async (req, res, next) => {
    try {
        const result = await commentService.createArticleComment(req.params.articleId, req.body.content);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateArticleComment = async (req, res, next) => {
    try {
        const result = await commentService.updateArticleComment(req.params.articleId, req.params.commentId, req.body.content);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteArticleComment = async (req, res, next) => {
    try {
        const result = await commentService.deleteArticleComment(req.params.articleId, req.params.commentId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};