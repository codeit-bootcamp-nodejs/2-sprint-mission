import db from '../config/db.ts';

const mypageRepository = {
    findUserById: (userId: number) => {
        return db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
            },
        });
    },

    updateUserInfo: (userId: number, data: { nickname: string; image: string }) => {
        return db.user.update({
            where: { id: userId },
            data: {
                nickname: data.nickname,
                image: data.image,
            },
            select: {
                nickname: true,
                image: true,
            },
        });
    },

    findUserWithPassword: (userId: number) => {
        return db.user.findUnique({ where: { id: userId } });
    },

    updateUserPassword: (userId: number, hashedPassword: string) => {
        return db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },

    findProductByUser: (userId: number) => {
        return db.product.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    findArticleByUser: (userId: number) => {
        return db.article.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    findProductCommentByUser: (userId: number) => {
        return db.productComment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    findArticleCommentByUser: (userId: number) => {
        return db.articleComment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    findLikeProducts: (userId: number) => {
        return db.productLike.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    findLikeArticles: (userId: number) => {
        return db.articleLike.findMany({
            where: { userId },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
};

export default mypageRepository;
