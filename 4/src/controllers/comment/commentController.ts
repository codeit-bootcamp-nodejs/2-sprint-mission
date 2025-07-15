import createCommentHandler from "./createCommentHandler";
import deleteCommentHandler from "./deleteCommentHandler";
import getCommentsOfRootCommentHandler from "./getCommentsOfRootCommentHandler";
import getRootCommentsListHandler from "./getRootCommentsListHandler";
import updateCommentHandler from "./updateCommentHandler";

const commentController = {
    getRootCommentsListHandler,
    getCommentsOfRootCommentHandler,
    createCommentHandler,
    updateCommentHandler,
    deleteCommentHandler
};

export default commentController;