const productService = require('../services/product.service');

exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const result = await productService.getProductById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const result = await productService.createProduct(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const result = await productService.updateProduct(req.params.id, req.body, req.file);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
