const { db } = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUserService = async ({ email, nickname, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
        data: { email, nickname, password: hashedPassword },
    });
    return user;
};
