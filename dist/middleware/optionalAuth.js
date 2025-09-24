"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const optionalAuth = (req, res, next) => {
    passport_1.default.authenticate("access-token", { session: false }, (err, user, info) => {
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};
exports.optionalAuth = optionalAuth;
