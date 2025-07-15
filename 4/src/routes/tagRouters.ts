import express from 'express';
import productController from '../controllers/product/productController';

const tagRouters = express.Router();
tagRouters.get(
    '/',
    productController.getTagsHandler
)

tagRouters.get(
    '/:name',
    productController.getProductsByTagHandler
);

export default tagRouters;