const productService = require('../services/product.service');

exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        console.log(`✅ 모든 상품 가져옴:`, result);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const productId = req.params.id;

        console.log('userId', userId);
        console.log('productId', productId);

        const result = await productService.getProductById(userId, productId);

        console.log(`✅ 개별 상품 가져옴:`, result);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        // createProduct 서비스에서 userId를 받아서 저장
        const userId = req.user.id;
        const result = await productService.createProduct({ ...req.body, userId });
        console.log(`✅ 상품 등록 완료:`, result);
        res.status(201).json({ message: 'Successfully created', result });
    } catch (error) {
        console.error(`error:`, error);
        return next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const product = await productService.getProductById(req.params.id);

        if (Number(product.userId) !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await productService.updateProduct(req.params.id, req.body, req.file);
        console.log(`✅ 업데이트 완료:`, result);
        res.status(200).json({ message: 'Successfully updated', result });
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const product = await productService.getProductById(req.params.id);

        if (Number(product.userId) !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await productService.deleteProduct(req.params.id);
        console.log(`✅ 삭제 완료:`, result);
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        next(err);
    }
};

exports.likeProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);

        // console.log('userId', userId);
        // console.log('productId', productId);

        const result = await productService.likeProduct(userId, productId);
        console.log('좋아요~', result);
        res.status(200).json({ message: '좋아요~♥️', result });
    } catch (error) {
        return next(error);
    }
};

exports.unlikeProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);

        // console.log('userId', userId);
        // console.log('productId', productId);

        const result = await productService.unlikeProduct(userId, productId);
        console.log('좋아요 취소~', result);
        res.status(200).json({ message: '좋아요 취소~♥️', result });
    } catch (error) {
        return next(error);
    }
};


