import commentService from "../../services/comment/commentService"
import { RequestHandler } from "express";

const getRootCommentsListHandler: RequestHandler = async function (req, res, next){
    const query:QueryType<CommentOrderByKey> = req.query;
    const whichId = req.params.id;
    const kind = req.params.kind as whereToLeaveComment;

    const rootCommentsList = await commentService.getRootCommentsList(kind, whichId, query);
    res.status(200).json(rootCommentsList);
}

export default getRootCommentsListHandler;