import bcrypt from 'bcrypt';

import mypageRepository from '../repositories/mypage.repository.ts';

const mypageService = {
    // 내 정보 조회
    getMyInfo: async (userId: number) => {
        return await mypageRepository.findUserById(userId);
    },

    // 내 정보 수정
    updateMyInfo: async (userId: number, data: { nickname: string; image: string }) => {
        return await mypageRepository.updateUserInfo(userId, data);
    },

    // 비밀번호 변경
    updateMyPw: async (userId: number, currentPassword: string, newPassword: string) => {
        const user = await mypageRepository.findUserWithPassword(userId);
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

        return await mypageRepository.updateUserPassword(userId, hashedPassword);
    },

    // 내가 등록한 상품 목록 조회
    getMyProducts: async (userId: number) => {
        return await mypageRepository.findProductByUser(userId);
    },

    // 내가 작성한 게시글 목록 조회
    getMyArticles: async (userId: number) => {
        return await mypageRepository.findArticleByUser(userId);
    },

    // 내가 작성한 댓글 목록 조회
    getMyComments: async (userId: number) => {
        const productComments = await mypageRepository.findProductCommentByUser(userId);
        const articleComments = await mypageRepository.findArticleCommentByUser(userId);

        return { productComments, articleComments };
    },

    // 내가 좋아요 한 상품 목록 조회
    getLikedProducts: async (userId: number) => {
        const likes = await mypageRepository.findLikeProducts(userId)
        return likes.map((like) => like.product);
    },

    // 내가 좋아요 한 게시글 목록 조회
    getLikedArticles: async (userId: number) => {
        const likes = await mypageRepository.findLikeArticles(userId)
        return likes.map((like) => like.article);
    },
};

export default mypageService;
