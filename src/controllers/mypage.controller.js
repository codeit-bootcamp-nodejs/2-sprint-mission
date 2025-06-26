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
