import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../model/prisma';

const register = async function (email: string, password: string, nickname: string) {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = crypto.randomUUID();
    const user = await db.user.create({
        data: {
            id: userId,
            nickname,
            email,
            password: hashedPassword,
            provider: "local",
            providerId: userId
        },
    });

    return user;
}

export default register;