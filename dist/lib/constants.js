"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_COOKIE_NAME = exports.ACCESS_TOKEN_COOKIE_NAME = exports.JWT_ACCESS_TOKEN_SECRET = exports.JWT_REFRESH_TOKEN_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'your_jwt_refresh_token_secret';
exports.JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';
exports.ACCESS_TOKEN_COOKIE_NAME = 'access-token';
exports.REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
