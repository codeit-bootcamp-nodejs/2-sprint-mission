import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const getProductListHandler: RequestHandler = async function (req, res, next){
    const query:QueryType<ProductOrderByKey> = req.query;
    const productsList = await productService.getProductsList(query);
    res.status(200).json(productsList);
}

export default getProductListHandler;