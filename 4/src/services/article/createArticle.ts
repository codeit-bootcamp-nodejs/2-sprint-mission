import db from "../../model/prisma"

const createArticle = async function (
    userId: string,
    title: string,
    content: string
) {
    const createdArticle = await db.article.create({
        data: {
            id: crypto.randomUUID(),
            title,
            content,
            userId
        }
    });

    return createdArticle;
};

export default createArticle;