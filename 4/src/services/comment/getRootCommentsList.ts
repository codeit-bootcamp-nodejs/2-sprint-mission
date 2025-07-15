import { Prisma } from "../../../generated/prisma";
import { devDebug } from "../../lib/debugs";
import db from "../../model/prisma";
import { commentOrderBySelector } from '../consts';

const getRootCommentsList = async function (
    whichOne: whereToLeaveComment,
    whichId: string,
    query: QueryType<CommentOrderByKey>
) {
    // const offset = query.offset ? Number(query.offset) : 0;
    return db.$transaction(async (tx) => {
        const limit = query.limit ? Number(query.limit) : 10;
        const orderBy = query.orderBy == null ? commentOrderBySelector['recent'] : commentOrderBySelector[query.orderBy];

        const titleSearch = query.title;
        const contentSearch = query.content;

        const lastCursor = query.lastCursor

        const where = {
            ...(whichOne === "articles" ?
                { articleId: whichId } :
                { productId: whichId }
            ),

            comment: {
                AND: [
                    ...(titleSearch !== undefined ? [{
                        title: {
                            contains: titleSearch,
                            mode: Prisma.QueryMode.insensitive
                        }
                    }] : []),
                    ...(contentSearch !== undefined ? [{
                        content: {
                            contains: contentSearch,
                            mode: Prisma.QueryMode.insensitive
                        }
                    }] : [])
                ]
            }
        };

        const restCondition = {
            take: limit,
            orderBy: {
                comment: {
                    ...orderBy
                }
            },

            include: {
                comment: true
            }
        };

        const articleFindManyObj = {
            where,
            ...(lastCursor !== undefined && {
                skip: 1,
                cursor: {
                    articleId_commentId: {
                        articleId: whichId,
                        commentId: lastCursor
                    }
                }
            }),
            ...restCondition,
        };

        const productFindManyObj = {
            where,
            ...(lastCursor !== undefined && {
                skip: 1,
                cursor: {
                    productId_commentId: {
                        productId: whichId,
                        commentId: lastCursor
                    }
                }
            }),
            ...restCondition,
        };

        let rootCommentList;
        if (whichOne === "articles") {
            rootCommentList = await tx.rootCommentToArticle.findMany(articleFindManyObj);
        } else {
            rootCommentList = await tx.rootCommentToProduct.findMany(productFindManyObj);
        }

        const metadata: metadataType = {
            lastCursor: null,
            hasNextPage: false,
        }

        if (rootCommentList.length === 0) {
            return { rootCommentList, metadata };
        }

        const lastCursorResult = rootCommentList[rootCommentList.length - 1];
        const lastCursorId = lastCursorResult.commentId;

        let nextPage;

        if (whichOne === "articles") {
            nextPage = await tx.rootCommentToArticle.findMany({
                where,
                skip: 1,
                cursor: {
                    articleId_commentId: {
                        articleId: whichId,
                        commentId: lastCursorId
                    }
                },
                ...restCondition
            });
        } else {
            nextPage = await tx.rootCommentToProduct.findMany({
                where,
                skip: 1,
                cursor: {
                    productId_commentId: {
                        productId: whichId,
                        commentId: lastCursorId
                    }
                },
                ...restCondition
            });
        }

        devDebug(nextPage);

        metadata.lastCursor = lastCursorId;
        metadata.hasNextPage = nextPage.length > 0;

        return { rootCommentList, metadata }
    });
};

export default getRootCommentsList;