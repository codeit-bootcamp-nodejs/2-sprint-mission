import db from '../config/db.ts';
import { Prisma } from '@prisma/client';
import { ArticleQuery, CreateArticle, UpdateArticleData } from '../types/article.ts';

const articleRepository = {
    findAll: async (query: ArticleQuery) => {
        const skip = Number(query.skip) || 0;
        const limit = Number(query.limit) || 10;
        const keyword = String(query.keyword || '');

        const where = keyword
            ? {
                  OR: [{ title: { contains: keyword, mode: 'insensitive' as const } }, { content: { contains: keyword, mode: 'insensitive' as const } }],
              }
            : {};

        return await db.article.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: { id: true, title: true, content: true, createdAt: true },
        });
    },

    findById: async (id: number) => {
        return await db.article.findUnique({ where: { id } });
    },

    findByIdWithLike: async (userId: number, articleId: number) => {
        const article = await db.article.findUnique({
            where: { id: articleId },
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

        if (!isNaN(userId)) {
            const like = await db.articleLike.findFirst({
                where: {
                    articleId,
                    userId,
                },
            });
            isLiked = !!like;
        }

        return { ...article, isLiked };
    },

    create: async (data: CreateArticle & { userId: number }) => {
        return await db.article.create({ data });
    },

    update: async (id: number, data: UpdateArticleData) => {
        const dataToUpdate: Prisma.ArticleUpdateInput = {
            title: data.title,
            content: data.content,
        };
        return await db.article.update({ where: { id }, data: dataToUpdate });
    },

    remove: async (id: number) => {
        return await db.article.delete({ where: { id } });
    },

    like: async (userId: number, articleId: number) => {
        const existing = await db.articleLike.findUnique({
            where: {
                userId_articleId: { userId, articleId },
            },
        });

        if (existing) {
            const error = new Error('이미 좋아요 했지~♥️');
            (error as any).status = 400;
            throw error;
        }

        return await db.articleLike.create({
            data: { userId, articleId },
        });
    },

    unlike: async (userId: number, articleId: number) => {
        const existing = await db.articleLike.findUnique({
            where: {
                userId_articleId: { userId, articleId },
            },
        });

        if (!existing) {
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

export default articleRepository;
