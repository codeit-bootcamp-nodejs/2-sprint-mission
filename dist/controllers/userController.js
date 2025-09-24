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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const token_1 = require("../lib/token");
const fs_1 = __importDefault(require("fs"));
const users_dto_1 = require("../dtos/users.dto");
const class_transformer_1 = require("class-transformer");
class UserController {
    constructor(userService) {
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const userId = req.user.id;
                const userProfile = yield this.userService.getUserProfile(userId);
                res.status(200).json(userProfile);
            }
            catch (error) {
                console.error("Error fetching user:", error);
                next(error);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let uploadedFilePath = null;
            try {
                const userData = (0, class_transformer_1.plainToInstance)(users_dto_1.CreateUserDto, req.body);
                let imageFilename = null;
                if (req.file) {
                    imageFilename = req.file.filename;
                    uploadedFilePath = req.file.path;
                }
                const newUser = yield this.userService.registerUser({
                    email: userData.email,
                    nickname: userData.nickname,
                    password: userData.password,
                    image: imageFilename !== null && imageFilename !== void 0 ? imageFilename : undefined,
                });
                const profileImageUrl = imageFilename
                    ? `/uploads/${imageFilename}`
                    : null;
                res.status(201).json({
                    message: "User registered successfully",
                    user: newUser,
                    profileImageUrl: profileImageUrl,
                });
            }
            catch (error) {
                console.error("Error during user registration:", error);
                if (uploadedFilePath && fs_1.default.existsSync(uploadedFilePath)) {
                    fs_1.default.unlinkSync(uploadedFilePath);
                    console.warn(`Rolled back uploaded file due to error: ${uploadedFilePath}`);
                }
                if (error.message ===
                    "Email already exist! Please Change to something else" ||
                    error.message ===
                        "Nickname already exist! Please Change to something else") {
                    return res.status(409).json({ message: error.message });
                }
                if (error instanceof Error &&
                    error.message.includes("Validation Error")) {
                    return res.status(400).json({
                        message: "Invalid registration data",
                        errors: error.message,
                    });
                }
                next(error);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const userId = req.user.id;
                const { accessToken, refreshToken } = yield this.userService.generateAuthTokens(userId);
                (0, token_1.setTokenCookies)(res, accessToken, refreshToken);
                const _a = req.user, { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
                res.status(200).json({ user: userWithoutPassword });
            }
            catch (error) {
                console.error("Login Error", error);
                next(error);
            }
        });
        this.patchUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const loggedInUser = req.user.id;
                const updateData = (0, class_transformer_1.plainToInstance)(users_dto_1.PatchUserDto, req.body);
                const updatedUser = yield this.userService.updateUser(loggedInUser, updateData);
                res
                    .status(200)
                    .json({ message: "User updated successfully!", user: updatedUser });
            }
            catch (error) {
                console.error("Error updating user:", error);
                if (error instanceof Error) {
                    return res
                        .status(400)
                        .json({ message: "Invalid update data", errors: error.message });
                }
                next(error);
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const id = Number(req.params.id);
                const loggedInUser = req.user.id;
                if (id !== loggedInUser) {
                    return res
                        .status(403)
                        .json({ message: "You are not authorized to delete this account." });
                }
                yield this.userService.deleteUser(id);
                res.status(204).send();
            }
            catch (error) {
                console.error("Error deleting user:", error);
                next(error);
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, token_1.clearTokenCookies)(res);
            res.status(200).send();
        });
        this.userService = userService;
    }
}
exports.UserController = UserController;
