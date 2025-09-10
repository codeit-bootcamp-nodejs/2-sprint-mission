import express, { Router } from "express";
const router = express.Router();
import passport from "../lib/passport/index";
import upload from "../middleware/upload";
import { refreshTokens } from "../lib/token";
import { validateDto } from "../middleware/validator";
import { CreateUserDto, PatchUserDto } from "../dtos/users.dto";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userReporitory";
import prisma from "../lib/prisma";
import { Auth } from "../middleware/Auth";

const UserRouter = (): Router => {
  const router = Router();

  const userReporitory = new UserRepository(prisma);
  const userService = new UserService(userReporitory);
  const userController = new UserController(userService);

  router.get(
    "/me",
    Auth,
    userController.getUser
  );
  router.post(
    "/register",
    upload.single("image"),
    validateDto(CreateUserDto),
    userController.register
  );
  router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    userController.login
  );
  router.post(
    "/refresh",
    passport.authenticate("refresh-token", { session: false }),
    refreshTokens
  );
  router.patch(
    "/me",
    Auth,
    validateDto(PatchUserDto),
    userController.patchUser
  );
  router.delete(
    "/:id",
    Auth,
    userController.deleteUser
  );
  router.post("/logout", userController.logout);

  return router;
};

export default UserRouter;
