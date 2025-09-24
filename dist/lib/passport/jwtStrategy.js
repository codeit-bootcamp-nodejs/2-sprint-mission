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
exports.refreshTokenStrategy = exports.accessTokenStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const prisma_1 = __importDefault(require("../prisma"));
const constants_1 = require("../constants");
const accessTokenOptions = {
    jwtFromRequest: (req) => req.cookies[constants_1.ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: constants_1.JWT_ACCESS_TOKEN_SECRET,
};
const refreshTokenOptions = {
    jwtFromRequest: (req) => req.cookies[constants_1.REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: constants_1.JWT_REFRESH_TOKEN_SECRET,
};
const jwtVerify = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: payload.sub },
        });
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
});
exports.accessTokenStrategy = new passport_jwt_1.Strategy(accessTokenOptions, jwtVerify);
exports.refreshTokenStrategy = new passport_jwt_1.Strategy(refreshTokenOptions, jwtVerify);
