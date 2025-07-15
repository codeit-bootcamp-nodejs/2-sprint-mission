import articleService from "../../services/article/articleService";
import { RequestHandler } from "express";

const getArticleByIdHandler: RequestHandler = async function (req, res, next){
    const articleId = req.params.id;
    const articleById = await articleService.getArticleById(articleId);
    res.status(200).json(articleById);
}

export default getArticleByIdHandler;