import db from "../../model/prisma";

const getArticleById = async function(
    articleOwnid: string
){
    const articleById = await db.article.findUniqueOrThrow({
        where:{
            id: articleOwnid
        },

        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            rootComments: {
                select:{
                    comment: true
                }
            }
        }
    });
    return articleById;
};

export default getArticleById;