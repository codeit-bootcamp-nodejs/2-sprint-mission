import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const getProductsByTagHandler: RequestHandler = async function (req, res, next){
    const tagName:string = req.params.name;
    const productsByTag = await productService.getProductsByTag(tagName);
    res.status(200).json(productsByTag);
}

export default getProductsByTagHandler;