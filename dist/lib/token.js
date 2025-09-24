"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.setTokenCookies = setTokenCookies;
exports.refreshTokens = refreshTokens;
exports.clearTokenCookies = clearTokenCookies;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
function generateTokens(userId) {
    const accessToken = jsonwebtoken_1.default.sign({ sub: userId }, constants_1.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: userId }, constants_1.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    return { accessToken, refreshToken };
}
function verifyAccessToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
}
function verifyRefreshToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
}
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie(constants_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: '/refresh',
    });
}
function refreshTokens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
        setTokenCookies(res, accessToken, newRefreshToken);
        res.status(200).send();
    });
}
;
function clearTokenCookies(res) {
    res.clearCookie(constants_1.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(constants_1.REFRESH_TOKEN_COOKIE_NAME);
}
