import articleService from "../../services/article/articleService";
import { RequestHandler } from "express";
import { devDebug } from "../../lib/debugs";

const updateArticleHandler: RequestHandler = async function (req, res, next){
    if(req.user == null){
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const articleId = req.params.id;
    const {title, content}:articleReqBody = req.body;
    const updatedArticle = await articleService.updateArticle(userId, articleId, title, content);

    res.status(200).json(updatedArticle);
};

export default updateArticleHandler;