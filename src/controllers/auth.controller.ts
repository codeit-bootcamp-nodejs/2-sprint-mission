import { Request, Response, NextFunction } from "express";
import { setTokensAsCookies, clearTokens } from "../utils/cookie.utils";
import authService from "../services/auth.service";
import { LoginUserDto, RegisterUserDto } from "../utils/dtos/auth.dto";

const authController = {
  // ✅ 회원가입
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: RegisterUserDto = req.body;

      // DB 저장 로직 추가
      const createdUser = await authService.registerUser(userData);

      res.status(201).json({ message: "회원가입 성공", user: createdUser });
    } catch (err) {
      next(err);
    }
  },

  // ✅ 로그인
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: LoginUserDto = req.body;
      const { accessToken, refreshToken, user } = await authService.loginUser(
        loginData
      );

      setTokensAsCookies(req, res, accessToken, refreshToken);
      res.status(200).json({ message: "로그인 성공", user });
    } catch (err) {
      next(err);
    }
  },

  // ✅ 로그아웃
  logout: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "로그인 필요" });
        return;
      }

      await authService.logout(userId);
      clearTokens(res);
      res.status(200).json({ message: "로그아웃 완료" });
    } catch (err) {
      next(err);
    }
  },

  // ✅ 토큰 재발급
  reissueAccessToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "RefreshToken 없음" }); // 이때 알맞은 예외처리는? 로그인 화면으로 리다이
      }

      const { accessToken, user } = await authService.reissueAccessToken(
        refreshToken
      );

      // 새로운 accessToken 쿠키로 재전송
      setTokensAsCookies(req, res, accessToken, refreshToken); // RefreshToken은 그대로 유지
      res.status(200).json({ message: "Access Token 재발급 완료", user });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
