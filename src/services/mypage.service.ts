import bcrypt from 'bcrypt';
import db from '../config/db.ts';

const mypageService = {
    // 내 정보 조회
    getMyInfo: async (userId: number) => {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
            },
        });
        return user;
    },

    // 내 정보 수정
    updateMyInfo: async (userId: number, data: { nickname: string; image: string }) => {
        const updated = await db.user.update({
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
        return updated;
    },

    // 비밀번호 변경
    updateMyPw: async (userId: number, currentPassword: string, newPassword: string) => {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            const error = new Error('사용자를 찾을 수 없음');
            (error as any).status = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            const error = new Error('현재 비밀번호 일치하지 않음');
            (error as any).status = 403;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        return await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },

    // 내가 등록한 상품 목록 조회
    getMyProducts: async (userId: number) => {
        const products = await db.product.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' },
        });

        return products;
    },

    // 내가 작성한 게시글 목록 조회
    getMyArticles: async (userId: number) => {
        const articles = await db.article.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' },
        });
        return articles;
    },

    // 내가 작성한 댓글 목록 조회
    getMyComments: async (userId: number) => {
        const productComments = await db.productComment.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' },
        });

        const articleComments = await db.articleComment.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' },
        });
        return { productComments, articleComments };
    },

    // 내가 좋아요 한 상품 목록 조회
    getLikedProducts: async (userId: number) => {
        const likes = await db.productLike.findMany({
            where: { userId: Number(userId) },
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
        return likes.map((like) => like.product);
    },

    // 내가 좋아요 한 게시글 목록 조회
    getLikedArticles: async (userId: number) => {
        const likes = await db.articleLike.findMany({
            where: { userId: Number(userId) },
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
        return likes.map((like) => like.article);
    },
};

export default mypageService;
