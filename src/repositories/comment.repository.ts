import db from '../config/db.ts';
import {
    CreateProductComment,
    UpdateProductComment,
    CreateArticleComment,
    UpdateArticleComment,
    ProductCommentQuery,
    ArticleCommentQuery,
} from '../types/comment.ts';

const commentRepository = {
    getAllProductComments: async (productId: number | string, query: ProductCommentQuery) => {
        const id = Number(productId);
        const limit = Number(query.limit ?? 10);
        const cursor = query.cursor ? Number(query.cursor) : null;

        if (!id || isNaN(id)) throw Object.assign(new Error('유효하지 않은 상품 ID'), { status: 404 });

        const product = await db.product.findUnique({ where: { id } });
        if (!product) throw Object.assign(new Error('조회할 상품 없음'), { status: 404 });

        const comments = await db.productComment.findMany({
            where: { productId: id },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'desc' },
            select: { id: true, content: true, createdAt: true },
        });

        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
        return { comments, nextCursor };
    },

    createProductComment: async ({ productId, userId, content }: CreateProductComment) => {
        const id = Number(productId);
        if (!content || !id || isNaN(id)) throw Object.assign(new Error('댓글 내용 또는 상품 ID가 유효하지 않음'), { status: 404 });

        const product = await db.product.findUnique({ where: { id } });
        if (!product) throw Object.assign(new Error('댓글 작성할 상품 없음'), { status: 404 });

        return await db.productComment.create({
            data: { content, user: { connect: { id: userId } }, product: { connect: { id } } },
        });
    },

    updateProductComment: async ({ productId, userId, commentId, content }: UpdateProductComment) => {
        const pid = Number(productId);
        const cid = Number(commentId);
        const uid = Number(userId);

        if (!content || isNaN(pid) || isNaN(cid) || isNaN(uid)) throw Object.assign(new Error('요청 정보 유효하지 않음'), { status: 400 });

        const comment = await db.productComment.findUnique({ where: { id: cid } });
        if (!comment) throw Object.assign(new Error('수정할 댓글 없음'), { status: 404 });
        if (comment.userId !== userId) throw Object.assign(new Error('작성자만 수정 가능'), { status: 403 });
        if (comment.productId !== pid) throw Object.assign(new Error('해당 상품에 작성된 댓글 아님'), { status: 403 });

        return await db.productComment.update({ where: { id: cid }, data: { content } });
    },

    deleteProductComment: async (userId: number, productId: number, commentId: number) => {
        const uid = Number(userId);
        const pid = Number(productId);
        const cid = Number(commentId);

        if (isNaN(uid) || isNaN(pid) || isNaN(cid)) throw Object.assign(new Error('유효하지 않은 요청'), { status: 400 });

        const comment = await db.productComment.findUnique({ where: { id: cid } });
        if (!comment) throw Object.assign(new Error('삭제할 댓글 없음'), { status: 404 });
        if (comment.userId !== userId) throw Object.assign(new Error('작성자만 삭제 가능'), { status: 403 });
        if (comment.productId !== pid) throw Object.assign(new Error('해당 상품에 작성된 댓글 아님'), { status: 403 });

        return await db.productComment.delete({ where: { id: cid } });
    },

    getAllArticleComments: async (articleId: number | string, query: ArticleCommentQuery) => {
        const id = Number(articleId);
        const limit = Number(query.limit ?? 10);
        const cursor = query.cursor ? Number(query.cursor) : null;

        if (!id || isNaN(id)) throw Object.assign(new Error('유효하지 않은 게시글 ID'), { status: 404 });

        const article = await db.article.findUnique({ where: { id } });
        if (!article) throw Object.assign(new Error('해당 게시글 없음'), { status: 404 });

        const comments = await db.articleComment.findMany({
            where: { articleId: id },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'desc' },
            select: { id: true, content: true, createdAt: true },
        });

        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
        return { comments, nextCursor };
    },

    createArticleComment: async ({ articleId, userId, content }: CreateArticleComment) => {
        const id = Number(articleId);
        if (!content || !id || isNaN(id)) throw Object.assign(new Error('댓글 또는 게시글 ID가 유효하지 않음'), { status: 400 });

        const article = await db.article.findUnique({ where: { id } });
        if (!article) throw Object.assign(new Error('댓글 작성할 게시글 없음'), { status: 404 });

        return await db.articleComment.create({
            data: { content, user: { connect: { id: userId } }, article: { connect: { id } } },
        });
    },

    updateArticleComment: async ({ articleId, userId, commentId, content }: UpdateArticleComment) => {
        const uid = Number(userId);
        const aid = Number(articleId);
        const cid = Number(commentId);

        if (!content || isNaN(uid) || isNaN(aid) || isNaN(cid)) throw Object.assign(new Error('요청 정보 유효하지 않음'), { status: 400 });

        const comment = await db.articleComment.findUnique({ where: { id: cid } });
        if (!comment) throw Object.assign(new Error('수정할 댓글 없음'), { status: 404 });
        if (comment.userId !== userId) throw Object.assign(new Error('작성자만 댓글 수정 가능'), { status: 403 });
        if (comment.articleId !== aid) throw Object.assign(new Error('해당 게시글에 작성된 댓글 아님'), { status: 403 });

        return await db.articleComment.update({ where: { id: cid }, data: { content } });
    },

    deleteArticleComment: async (userId: number, articleId: number, commentId: number) => {
        const uid = Number(userId);
        const aid = Number(articleId);
        const cid = Number(commentId);

        if (isNaN(uid) || isNaN(aid) || isNaN(cid)) throw Object.assign(new Error('유효하지 않은 요청'), { status: 400 });

        const comment = await db.articleComment.findUnique({ where: { id: cid } });
        if (!comment) throw Object.assign(new Error('삭제할 댓글 없음'), { status: 404 });
        if (comment.userId !== userId) throw Object.assign(new Error('작성자만 삭제 가능'), { status: 403 });
        if (comment.articleId !== aid) throw Object.assign(new Error('해당 게시글에 작성된 댓글 아님'), { status: 403 });

        return await db.articleComment.delete({ where: { id: cid } });
    },
};

export default commentRepository;
