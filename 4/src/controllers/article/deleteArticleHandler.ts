import { devDebug } from "../../lib/debugs";
import articleService from "../../services/article/articleService";
import { RequestHandler } from "express";

const deleteArticleHandler: RequestHandler = async function (req, res, next){
    if(req.user == null){
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    
    const userId = req.user.id;
    const articleId = req.params.id;
    const articleById = await articleService.deleteArticle(userId, articleId);
    res.status(200).json(articleById);
}

export default deleteArticleHandler;