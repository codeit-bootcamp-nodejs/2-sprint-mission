const mypageService = require('../services/mypage.service');

// 내 정보 조회
exports.getMyInfo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await mypageService.getMyInfo(userId);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// 내 정보 수정
exports.updateMyInfo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        const updated = await mypageService.updateMyInfo(userId, data);

        res.status(200).json({ message: '내 정보 수정 완료', updated });
    } catch (error) {
        next(error);
    }
};

// 비밀번호 변경
exports.updateMyPw = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const updated = await mypageService.updateMyPw(userId, currentPassword, newPassword);

        res.status(200).json({ message: '비밀번호 변경 완료', updated });
    } catch (error) {
        next(error);
    }
};

// 내가 등록한 상품 목록 조회
exports.getMyProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const products = await mypageService.getMyProducts(userId);

        res.status(200).json({ message: '내가 등록한 상품 목록', products });
    } catch (error) {
        next(error);
    }
};

// 내가 작성한 게시글 목록 조회
exports.getMyArticles = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const articles = await mypageService.getMyArticles(userId);

        res.status(200).json({ message: '내가 작성한 게시글 목록', articles });
    } catch (error) {
        next(error);
    }
};

// 내가 작성한 댓글 목록 조회
exports.getMyComments = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const comments = await mypageService.getMyComments(userId);

        res.status(200).json({ message: '내가 작성한 댓글 목록', comments });
    } catch (error) {
        next(error);
    }
};

// 내가 좋아요 한 상품 목록 조회
exports.getLikedProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const products = await mypageService.getLikedProducts(userId);

        res.status(200).json({ message: '내가 좋아요 한 상품 목록', products });
    } catch (error) {
        next(error);
    }
};

// 내가 좋아요 한 게시글 목록 조회
exports.getLikedArticles = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const articles = await mypageService.getLikedArticles(userId);

        res.status(200).json({ message: '내가 좋아요 한 게시글 목록', articles });
    } catch (error) {
        next(error);
    }
};
