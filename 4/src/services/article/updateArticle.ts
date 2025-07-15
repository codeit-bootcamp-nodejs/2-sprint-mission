import db from "../../model/prisma";

const updateArticle = async function (
    userId: string,
    articleId: string, 
    title: string,
    content: string
) {
    const updatedArticle = await db.article.update({
        where:{
            id: articleId,
            userId
        },
        data: {
            title,
            content
        }
    });

    return updatedArticle;
};

export default updateArticle;