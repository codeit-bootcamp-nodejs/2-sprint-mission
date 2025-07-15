import db from "../../model/prisma";
import { commentOrderBySelector } from "../consts";

const getCommentsOfRootComment = async function(
    whichOne: whereToLeaveComment,
    whichId: string,
    commentId: string
){
    return db.$transaction(async (tx) => {
        if(whichOne === "articles"){
            await tx.rootCommentToArticle.findUniqueOrThrow({
                where:{
                    articleId_commentId:{
                        articleId: whichId,
                        commentId
                    }
                }
            });
        } else {
            await tx.rootCommentToProduct.findUniqueOrThrow({
                where:{
                    productId_commentId:{
                        productId:whichId,
                        commentId
                    }
                }
            });
        }

        const commentsOfRootComment = await tx.comment.findMany({
            where: {
                id: commentId
            },

            include:{
                comments:{
                    orderBy:{
                        ...commentOrderBySelector['oldest']
                    }
                }
            }
        });

        return commentsOfRootComment;
    });
};

export default getCommentsOfRootComment;