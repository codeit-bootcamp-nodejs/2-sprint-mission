import db from '../config/db.ts';

const authRepository = {
    registerUser: async (email: string, nickname: string, hashedPassword: string) => {
        return await db.user.create({
            data: { email, nickname, password: hashedPassword },
        });
    },

    updateUserRefreshToken: async (userId: number, refreshToken: string) => {
        return await db.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    },
    findUserById: async (userId: number) => {
        return await db.user.findUnique({
            where: { id: userId },
        });
    },
};

export default authRepository;
