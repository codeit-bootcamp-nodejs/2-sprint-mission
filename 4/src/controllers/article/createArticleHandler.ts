import articleService from "../../services/article/articleService";
import { RequestHandler } from "express";
import { devDebug } from "../../lib/debugs";

const createArticleHandler: RequestHandler = async function (req, res, next){
    if(req.user == null){
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const {title, content}:articleReqBody = req.body;
    const createdArticle = await articleService.createArticle(userId, title, content);

    res.status(201).json(createdArticle);
};

export default createArticleHandler;