import { devDebug } from "../../lib/debugs";
import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const createProductHandler: RequestHandler = async function (req, res, next) {
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const { name, description, price, tags } = req.body;
    const userId = req.user.id;
    const createdProduct = await productService.createProduct(userId, name, description, price, tags);
    res.status(201).json(createdProduct);
}

export default createProductHandler;