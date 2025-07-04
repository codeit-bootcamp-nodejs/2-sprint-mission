const jwt = require('jsonwebtoken');
const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = require('./constants.js');

// jwt.sign > 토큰 생성
function generateTokens(userId) {
    const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
    return { accessToken, refreshToken };
}

// jwt.verify > 토큰 검증
function verifyAccessToken(token) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
}

function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
}

export default { generateTokens, verifyAccessToken, verifyRefreshToken };
