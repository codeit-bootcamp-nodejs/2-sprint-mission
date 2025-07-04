import { Prisma } from '@prisma/client';
import db from '../config/db.ts';
import { CreateArticle, UpdateArticle, ArticleQuery } from '../types/article.ts';

const articleService = {
    // 게시글 전체 목록 조회
    getAllArticles: async (query: ArticleQuery) => {
        const skip = Number(query.skip) || 0;
        const limit = Number(query.limit) || 10;
        const keyword = String(query.keyword || '');

        if (skip < 0 || limit < 0 || isNaN(skip) || isNaN(limit)) {
            const error = new Error();
            (error as any).status = 400;
            throw error;
        }

        const where = keyword
            ? {
                  OR: [{ title: { contains: keyword, mode: 'insensitive' as const } }, { content: { contains: keyword, mode: 'insensitive' as const } }],
              }
            : {};

        const articles = await db.article.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: { id: true, title: true, content: true, createdAt: true },
        });

        return articles;
    },

    // 게시글 상세 목록 조회
    getArticleById: async (userId: number, articleId: number) => {
        const uid = Number(userId);
        const aid = Number(articleId);

        if (isNaN(aid)) {
            const error = new Error('유효하지 않은 게시글 ID');
            (error as any).status = 400;
            throw error;
        }

        const article = await db.article.findUnique({
            where: { id: aid },
            select: {
                id: true,
                title: true,
                content: true,
                userId: true,
            },
        });

        if (!article) {
            const error = new Error('조회할 게시글 없음');
            (error as any).status = 404;
            throw error;
        }

        let isLiked = false;

        if (!isNaN(uid)) {
            const like = await db.articleLike.findFirst({
                where: {
                    articleId: aid,
                    userId: uid,
                },
            });
            isLiked = !!like;
        }

        return { ...article, isLiked };
    },

    // 게시글 생성
    createArticle: async (data: CreateArticle & { userId: number }) => {
        const { userId, title, content } = data;
        return await db.article.create({ data: { userId, title, content } });
    },

    // 게시글 수정
    updateArticle: async ({ id, data }: UpdateArticle) => {
        const article = await db.article.findUnique({ where: { id: Number(id) } });
        if (!article) {
            const error = new Error('수정할 게시글 없음');
            (error as any).status = 404;
            throw error;
        }

        const dataToUpdate: Prisma.ArticleUpdateInput = {
            title: data.title,
            content: data.content,
        };

        return await db.article.update({ where: { id: Number(id) }, data: dataToUpdate });
    },

    // 게시글 삭제
    deleteArticle: async (id: number) => {
        const article = await db.article.findUnique({ where: { id: Number(id) } });
        if (!article) {
            const error = new Error('삭제할 게시글 없음');
            (error as any).status = 404;
            throw error;
        }
        return await db.article.delete({ where: { id: Number(id) } });
    },

    // 게시글 좋아요♥️
    likeArticle: async (userId: number, articleId: number) => {
        const likeArticle = await db.articleLike.findUnique({
            where: {
                userId_articleId: { userId, articleId },
            },
        });

        if (likeArticle) {
            const error = new Error('이미 좋아요 했지~♥️');
            (error as any).status = 400;
            throw error;
        }

        const like = await db.articleLike.create({
            data: { userId, articleId },
        });
        return like;
    },

    // 게시글 좋아요❌
    unlikeArticle: async (userId: number, articleId: number) => {
        const unlikeArticle = await db.articleLike.findUnique({
            where: {
                userId_articleId: { userId, articleId },
            },
        });

        if (!unlikeArticle) {
            const error = new Error('아직 좋아요 안했지~♥️');
            (error as any).status = 400;
            throw error;
        }

        await db.articleLike.delete({
            where: {
                userId_articleId: { userId, articleId },
            },
        });
        return { articleId };
    },
};

export default articleService;
