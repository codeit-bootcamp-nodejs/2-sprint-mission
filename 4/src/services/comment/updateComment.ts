import { devDebug } from "../../lib/debugs";
import db from "../../model/prisma";

const updateComment = async function (
    userId: string,
    // whichOne: whereToLeaveComment,
    // whichId: string,
    commentId: string,
    content: string,
    title?: string,
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

        const updatedComment = await tx.comment.update({
            where: {
                id: commentId,
                userId
            },
            data: {
                ...(title !== undefined && { title }),
                content
            }
        });

    return updatedComment;
})
};

export default updateComment;