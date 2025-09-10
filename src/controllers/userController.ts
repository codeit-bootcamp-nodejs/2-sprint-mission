import { NextFunction, Request, Response } from "express";
import { setTokenCookies, clearTokenCookies } from "../lib/token";
import fs from "fs";
import { UserService } from "../services/userService";
import { CreateUserDto, PatchUserDto } from "../dtos/users.dto";
import { plainToInstance } from "class-transformer";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // 정보조회
  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const userProfile = await this.userService.getUserProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      console.error("Error fetching user:", error);
      next(error);
    }
  };

  //회원가입
  register = async (req: Request, res: Response, next: NextFunction) => {
    let uploadedFilePath: string | null = null;
    try {
      const userData = plainToInstance(CreateUserDto, req.body);

      let imageFilename: string | null = null;
      if (req.file) {
        imageFilename = req.file.filename;
        uploadedFilePath = req.file.path; // 롤백을 위해 파일 경로 저장
      }

      const newUser = await this.userService.registerUser({
        email: userData.email,
        nickname: userData.nickname,
        password: userData.password,
        image: imageFilename ?? undefined,
      });

      const profileImageUrl = imageFilename
        ? `/uploads/${imageFilename}`
        : null;
      res.status(201).json({
        message: "User registered successfully",
        user: newUser, // 비밀번호 없는 사용자 정보
        profileImageUrl: profileImageUrl,
      });
    } catch (error: any) {
      console.error("Error during user registration:", error);
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
        console.warn(
          `Rolled back uploaded file due to error: ${uploadedFilePath}`
        );
      }
      if (
        error.message ===
          "Email already exist! Please Change to something else" ||
        error.message ===
          "Nickname already exist! Please Change to something else"
      ) {
        return res.status(409).json({ message: error.message });
      }
      if (
        error instanceof Error &&
        error.message.includes("Validation Error")
      ) {
        return res.status(400).json({
          message: "Invalid registration data",
          errors: error.message,
        });
      }
      next(error);
    }
  };

  //로그인
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;

      const { accessToken, refreshToken } =
        await this.userService.generateAuthTokens(userId);

      setTokenCookies(res, accessToken, refreshToken);
      const { password, ...userWithoutPassword } = req.user;

      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login Error", error);
      next(error);
    }
  };

  //회원정보 수정
  patchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const loggedInUser = req.user.id;

      const updateData = plainToInstance(PatchUserDto, req.body);

      const updatedUser = await this.userService.updateUser(
        loggedInUser,
        updateData
      );

      res
        .status(200)
        .json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof Error) {
        return res
          .status(400)
          .json({ message: "Invalid update data", errors: error.message });
      }
      next(error);
    }
  };

  //user 삭제
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
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

      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      next(error);
    }
  };
  logout = async (req: Request, res: Response) => {
    clearTokenCookies(res);
    res.status(200).send();
  };
}
