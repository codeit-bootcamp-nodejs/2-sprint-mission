"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const router = express_1.default.Router();
const index_1 = __importDefault(require("../lib/passport/index"));
const upload_1 = __importDefault(require("../middleware/upload"));
const token_1 = require("../lib/token");
const validator_1 = require("../middleware/validator");
const users_dto_1 = require("../dtos/users.dto");
const userService_1 = require("../services/userService");
const userController_1 = require("../controllers/userController");
const userReporitory_1 = require("../repositories/userReporitory");
const prisma_1 = __importDefault(require("../lib/prisma"));
const Auth_1 = require("../middleware/Auth");
const UserRouter = () => {
    const router = (0, express_1.Router)();
    const userReporitory = new userReporitory_1.UserRepository(prisma_1.default);
    const userService = new userService_1.UserService(userReporitory);
    const userController = new userController_1.UserController(userService);
    router.get("/me", Auth_1.Auth, userController.getUser);
    router.post("/register", upload_1.default.single("image"), (0, validator_1.validateDto)(users_dto_1.CreateUserDto), userController.register);
    router.post("/login", index_1.default.authenticate("local", { session: false }), userController.login);
    router.post("/refresh", index_1.default.authenticate("refresh-token", { session: false }), token_1.refreshTokens);
    router.patch("/me", Auth_1.Auth, (0, validator_1.validateDto)(users_dto_1.PatchUserDto), userController.patchUser);
    router.delete("/:id", Auth_1.Auth, userController.deleteUser);
    router.post("/logout", userController.logout);
    return router;
};
exports.default = UserRouter;
