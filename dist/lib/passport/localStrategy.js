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
exports.localStrategy = void 0;
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../prisma"));
exports.localStrategy = new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
    });
});
