const mypageService = require('../services/mypage.service');

exports.getMyInfo = async (req, res, next) => {
    try {
        console.log('로그인한 사용자:', req.user);
        const userId = req.user.id;
        const user = await mypageService.getMyInfo(userId);

        res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

exports.updateMyInfo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        // console.log('userId:', userId);
        // console.log('content:', data);

        const updated = await mypageService.updateMyInfo(userId, data);

        res.status(200).json(updated);
    } catch (error) {
        return next(error);
    }
};

exports.updateMyPw = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        console.log(currentPassword);
        console.log(newPassword);

        const updated = await mypageService.updateMyPw(userId, currentPassword, newPassword);

        res.status(200).json(updated);
    } catch (error) {
        return next(error);
    }
};

exports.getMyProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // console.log('로그인한 사용자:', userId);

        const products = await mypageService.getMyProducts(userId);

        res.status(200).json({ message: '유저가 등록한 상품 목록 입니다.', products });
    } catch (error) {
        return next(error);
    }
};

exports.getMyArticles = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const articles = await mypageService.getMyArticles(userId);

        res.status(200).json({ message: '유저가 등록한 게시글 목록 입니다.', articles });
    } catch (error) {
        return next(error);
    }
};

exports.getMyComments = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const comments = await mypageService.getMyComments(userId);

        res.status(200).json({ message: '유저가 작성한 댓글 목록 입니다.', comments });
    } catch (error) {
        return next(error);
    }
};

exports.getLikedProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const products = await mypageService.getLikedProducts(userId);

        console.log('👍 좋아요한 상품 목록:', products);

        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
};

exports.getLikedArticles = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const articles = await mypageService.getLikedArticles(userId);

        console.log('👍 좋아요한 게시글 목록:', articles);

        res.status(200).json(articles);
    } catch (error) {
        return next(error);
    }
};
