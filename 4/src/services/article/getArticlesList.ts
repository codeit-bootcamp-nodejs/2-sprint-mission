import { Prisma } from '../../../generated/prisma';
import db from "../../model/prisma"
import { articleOrderBySelector } from '../consts';

const getArticlesList = async function(
    query: QueryType<ArticleOrderByKey>
){

    const offset = query.offset ? Number(query.offset) : 0;
    const limit = query.limit ? Number(query.limit) : 10;
    const orderBy = query.orderBy == null ? articleOrderBySelector['recent'] : articleOrderBySelector[query.orderBy];

    const titleSearch = query.title;
    const contentSearch = query.content;

    const articlesList = await db.article.findMany({
        where: {
            ...(titleSearch !== undefined && {
                title: {
                    contains: titleSearch,
                    mode: Prisma.QueryMode.insensitive
                }
            }),
            ...(contentSearch !== undefined && {
                content: { 
                    contains: contentSearch, 
                    mode: Prisma.QueryMode.insensitive 
                }
            })
        },

        select: {
            id: true,
            title: true,
            content: true,
            userId: true,
            createdAt: true,
            updatedAt: true
        },

        orderBy,

        skip: offset,
        take: limit
    });

    return articlesList;
};

export default getArticlesList;