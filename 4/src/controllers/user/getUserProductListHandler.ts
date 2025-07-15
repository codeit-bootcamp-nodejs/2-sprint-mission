import { devDebug } from "../../lib/debugs";
import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const getUserProductListHandler:RequestHandler = async function(req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const query:QueryType<ProductOrderByKey> = req.query;

    const userProductsList = await productService.getProductsList(query, userId);

    res.status(200).json(userProductsList);
};

export default getUserProductListHandler;