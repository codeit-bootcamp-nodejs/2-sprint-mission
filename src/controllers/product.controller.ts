const productService = require('../services/product.service');

// 상품 전체 목록 조회
exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// 상품 상세 목록 조회
exports.getProductById = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const productId = req.params.id;

        const result = await productService.getProductById(userId, productId);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// 상품 생성
exports.createProduct = async (req, res, next) => {
    try {
        // createProduct 서비스에서 userId를 받아서 저장
        const userId = req.user.id;
        const result = await productService.createProduct({ ...req.body, userId });

        res.status(201).json({ message: '상품 생성 완료', result });
    } catch (error) {
        next(err);
    }
};

// 상품 수정
exports.updateProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        // 작성자 확인을 위해 userId 포함해서 조회
        const product = await productService.getProductById(userId, productId);

        // 작성자만 수정 가능
        if (product.userId !== userId) {
            return res.status(403).json({ message: '작성자 본인만 수정 가능' });
        }

        const result = await productService.updateProduct(productId, req.body, req.file);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const product = await productService.getProductById(userId, productId);

        if (Number(product.userId) !== Number(userId)) {
            return res.status(403).json({ message: '작성자 본인만 삭제 가능' });
        }

        const result = await productService.deleteProduct(productId);
        res.status(200).json({ message: '상품 삭제 완료 ', result });
    } catch (error) {
        next(error);
    }
};

// 상품 좋아요♥️
exports.likeProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);

        const result = await productService.likeProduct(userId, productId);

        res.status(200).json({ message: '좋아요~♥️', result });
    } catch (error) {
        next(error);
    }
};

// 상품 좋아요❌
exports.unlikeProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);

        const result = await productService.unlikeProduct(userId, productId);

        res.status(200).json({ message: '좋아요 취소~♥️', result });
    } catch (error) {
        next(error);
    }
};
