import productService from "../../services/product/productService";
import { RequestHandler } from "express";

const getTagsHandler: RequestHandler = async function (req, res, next){
    const allTags = await productService.getTags();
    res.status(200).json(allTags);
}

export default getTagsHandler;