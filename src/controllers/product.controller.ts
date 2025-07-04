import { Request, Response, NextFunction, RequestHandler } from 'express';
import productService from '../services/product.service.ts';
import { CreateProduct } from '../types/product.ts';

const productController = {
    getAllProducts: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await productService.getAllProducts(req.query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    getProductById: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.user?.id);
            const productId = Number(req.params.id);
            const result = await productService.getProductById(userId, productId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    createProduct: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const result = await productService.createProduct({ ...(req.body as CreateProduct), userId });
            res.status(201).json({ message: '상품 생성 완료', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    updateProduct: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.id);
            const product = await productService.getProductById(userId, productId);

            if (product.userId !== userId) {
                return res.status(403).json({ message: '작성자 본인만 수정 가능' });
            }

            const result = await productService.updateProduct({ id: productId, data: req.body, file: req.file });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    deleteProduct: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.id);
            const product = await productService.getProductById(userId, productId);

            if (Number(product.userId) !== Number(userId)) {
                return res.status(403).json({ message: '작성자 본인만 삭제 가능' });
            }

            const result = await productService.deleteProduct(productId);
            res.status(200).json({ message: '상품 삭제 완료 ', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    likeProduct: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.productId);
            const result = await productService.likeProduct(userId, productId);
            res.status(200).json({ message: '좋아요~♥️', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    unlikeProduct: (async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: '로그인 필요함' });

            const productId = Number(req.params.productId);
            const result = await productService.unlikeProduct(userId, productId);
            res.status(200).json({ message: '좋아요 취소~♥️', result });
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,
};

export default productController;
