import express from 'express';
import productController from '../controllers/product/productController';
import passport from '../lib/middlewares/passport';

const productRouters = express.Router();

productRouters.get(
    '/',
    productController.getProductListHandler
);

productRouters.get(
    '/:id',
    productController.getProductByIdHandler
);

productRouters.post(
    '/create',
    passport.authenticate('accessToken', { session: false }),
    productController.createProductHandler
);

productRouters.patch(
    '/:id/update',
    passport.authenticate('accessToken', { session: false }),
    productController.updateProductHandler
);

productRouters.delete(
    '/:id/delete',
    passport.authenticate('accessToken', { session: false }),
    productController.deleteProductHandler
);


export default productRouters;