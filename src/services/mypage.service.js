const bcrypt = require('bcrypt');
const { db } = require('../config/db');

exports.getMyInfo = async (userId) => {
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
};

exports.updateMyInfo = async (userId, data) => {
    const updated = await db.user.update({
        where: { id: userId },
        data: {
            nickname: data.nickname,
            imageUrl: data.imageUrl,
        },
        select: {
            nickname: true,
            image: true,
        },
    });
    return updated;
};

exports.updateMyPw = async (userId, currentPassword, newPassword) => {
    // 1. 유저 정보 불러오기
    const user = await db.user.findUnique({ where: { id: userId } });

    // 2. 현재 비밀번호 확인
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        const error = new Error('현재 비밀번호가 일치하지 않습니다.');
        error.status = 403;
        throw error;
    }

    // 3. 새 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. 비밀번호 업데이트
    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
};


