"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const passport_1 = __importDefault(require("passport"));
const Auth = (req, res, next) => {
    passport_1.default.authenticate("access-token", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.Auth = Auth;
