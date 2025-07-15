import { devDebug } from "../../lib/debugs";
import commentService from "../../services/comment/commentService"
import { RequestHandler } from "express";

const deleteCommentHandler: RequestHandler = async function (req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const commentId = req.params.cid;
    const userId = req.user.id;
    const deletedArticle = await commentService.deleteComment(userId, commentId);

    res.status(200).json(deletedArticle);
};

export default deleteCommentHandler;