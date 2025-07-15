import db from "../../model/prisma";

const deleteArticle = async function (
    userId: string,
    articleId: string
) {
    return db.$transaction(async (tx) => {
        const commentToArticle = await tx.rootCommentToArticle.findMany({
            where: { articleId }
        });
    
        const deletedArticle = await tx.article.delete({
            where:{
                id: articleId,
                userId
            }
        });

        const commentIds = commentToArticle.map(obj => obj.commentId);
    
        await tx.comment.deleteMany({
            where:{
                id: {in: commentIds}
            }
        });
    
        return deletedArticle;
    });
};

export default deleteArticle;