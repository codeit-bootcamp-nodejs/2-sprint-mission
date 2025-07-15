import { devDebug } from "../../lib/debugs";
import db from "../../model/prisma";

const deleteComment = async function (
    // whichOne: whereToLeaveComment,
    // whichId: string,
    userId: string,
    commentId: string
) {
    return db.$transaction(async(tx) => {

        // if(whichOne === "articles"){
        //     await tx.rootCommentToArticle.findUniqueOrThrow({
        //         where:{
        //             articleId_commentId:{
        //                 articleId: whichId,
        //                 commentId
        //             }
        //         }
        //     });
        // } else {
        //     await tx.rootCommentToProduct.findUniqueOrThrow({
        //         where:{
        //             productId_commentId:{
        //                 productId: whichId,
        //                 commentId
        //             }
        //         }
        //     });
        // }

        const deletedComment = await tx.comment.delete({
            where: {
                id: commentId,
                userId
            }
        });

        await tx.comment.updateMany({
            where:{
                replyId:deletedComment.id
            },

            data:{
                replyId:deletedComment.parentId
            }
        });

    return deletedComment;
})
};

export default deleteComment;