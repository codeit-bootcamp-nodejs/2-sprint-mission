import commentService from "../../services/comment/commentService"
import { RequestHandler } from "express";

const getCommentsOfRootCommentHandler: RequestHandler = async function (req, res, next){
    const whichId = req.params.id;
    const commentId = req.params.cid;
    const kind = req.params.kind as whereToLeaveComment;

    const rootCommentsList = await commentService.getCommentsOfRootComment(kind, whichId, commentId);
    res.status(200).json(rootCommentsList);
}

export default getCommentsOfRootCommentHandler;