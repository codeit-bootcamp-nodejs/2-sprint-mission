import commentService from "../../services/comment/commentService";
import { RequestHandler } from "express";
import { devDebug } from "../../lib/debugs";

const createCommentHandler: RequestHandler = async function (req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const whichId = req.params.id;
    const commentId = req.params.cid;
    const kind = req.params.kind as whereToLeaveComment;

    const {title, content}:commentReqBody = req.body;
    const createdComment = await commentService.createComment(userId, kind, whichId, content, commentId, title);

    res.status(201).json(createdComment);
};

export default createCommentHandler;