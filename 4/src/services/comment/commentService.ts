import createComment from "./createComment";
import deleteComment from "./deleteComment";
import getCommentsOfRootComment from "./getCommentsOfRootComment";
import getRootCommentsList from "./getRootCommentsList";
import updateComment from "./updateComment";

const commentService = {
    getCommentsOfRootComment,
    getRootCommentsList,
    createComment,
    updateComment,
    deleteComment
};

export default commentService;