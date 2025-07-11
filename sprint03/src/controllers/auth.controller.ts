import { RequestHandler } from "express";
import { AuthService } from "../services/auth.service";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
} from "../utils/dtos/auth.dto";

// 회원 가입
const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body as RegisterDto;

    const userWithoutPassword = await AuthService.register({
      email,
      password,
      nickname,
    });

    res.status(201).json({
      message: "가입 완료",
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

// 로그인
const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginDto;

    const tokens = await AuthService.login({ email, password });

    res.status(200).json({
      message: "로그인 성공",
      accesstoken: tokens.accessToken,
      refreshtoken: tokens.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// 토큰 재 발급
const refreshAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body as RefreshTokenDto;

    const tokens = await AuthService.refreshAccessToken({ refreshToken });

    res.status(200).json({
      messege: "토큰 재발급 완료.",
      accesstoken: tokens.accessToken,
      refreshtoken: tokens.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export { register, login, refreshAccessToken };
