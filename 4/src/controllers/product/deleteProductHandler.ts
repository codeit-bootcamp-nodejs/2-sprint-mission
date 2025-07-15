import { devDebug } from "../../lib/debugs";
import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const deleteProductHandler: RequestHandler = async function (req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const productId:string = req.params.id;
    const userId = req.user.id;
    const deletedProduct = await productService.deleteProduct(userId, productId);
    res.status(204).json(deletedProduct);
}

export default deleteProductHandler;