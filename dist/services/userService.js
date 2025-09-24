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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../lib/token");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            return {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        });
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEmail = yield this.userRepository.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error("Email already exist! Please Change to something else");
            }
            const existingNickname = yield this.userRepository.findByNickname(userData.nickname);
            if (existingNickname) {
                throw new Error("Nickname already exist! Please Change to something else");
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, salt);
            const newUser = yield this.userRepository.create({
                email: userData.email,
                nickname: userData.nickname,
                password: hashedPassword,
                image: userData.image,
            });
            return {
                id: newUser.id,
                email: newUser.email,
                nickname: newUser.nickname,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            };
        });
    }
    generateAuthTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken, refreshToken } = (0, token_1.generateTokens)(userId);
            return { accessToken, refreshToken };
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updateData.password) {
                const salt = yield bcrypt_1.default.genSalt(10);
                updateData.password = yield bcrypt_1.default.hash(updateData.password, salt);
            }
            try {
                const userUpdateData = {};
                if (updateData.email !== undefined) {
                    userUpdateData.email = updateData.email;
                }
                if (updateData.nickname !== undefined) {
                    userUpdateData.nickname = updateData.nickname;
                }
                if (updateData.password !== undefined) {
                    userUpdateData.password = updateData.password;
                }
                if (updateData.image !== undefined) {
                    userUpdateData.image = updateData.image;
                }
                const updatedUser = yield this.userRepository.update(userId, userUpdateData);
                if (!updatedUser) {
                    throw new Error("User not found or update failed");
                }
                return {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    nickname: updatedUser.nickname,
                    createdAt: updatedUser.createdAt,
                    updatedAt: updatedUser.updatedAt,
                };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002") {
                    throw new Error("Email or User nickname already exist! Please Change to something else");
                }
                throw error;
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findById(userId);
            if (!existingUser) {
                throw new Error("User not found");
            }
            yield this.userRepository.delete(userId);
            return { message: "User deleted successfully" };
        });
    }
}
exports.UserService = UserService;
