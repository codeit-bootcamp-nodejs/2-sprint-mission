import { devDebug } from "../../lib/debugs";
import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const updateProductHandler: RequestHandler = async function (req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const { name, description, price, tags } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;
    const updatedProduct = await productService.updateProduct(userId, productId, name, description, price, tags);
    res.status(200).json(updatedProduct);
}

export default updateProductHandler;