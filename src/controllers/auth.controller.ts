import { Request, Response } from "express";
import { handleError } from "../utils/error";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "../utils/const";
import { LoginDto } from "../dtos/auth.dto";
import AuthService from "../services/auth.service";
import { CreateUserDto } from "../dtos/user.dto";
import { setCookie } from "../utils/token";

export default class AuthController {
  /**
   * @description 사용자 회원가입
   * @route POST /auth/register
   *
   * @param {string} req.body.email - 사용자 email
   * @param {string} req.body.nickname - 사용자 nickname
   * @param {string} req.body.password - 사용자 password
   * @param {string} req.body.image - 사용자 image
   */
  static async register(req: Request, res: Response) {
    const body: CreateUserDto = req.body;
    const userWithoutPassword = await AuthService.register(body);
    res.status(201).json({ userWithoutPassword });
  }

  /**
   * @description 사용자 로그인
   * @route POST /auth/login
   *
   * @param {string} req.body.email - 사용자 email
   * @param {string} req.body.password - 사용자 password
   */
  static async login(req: Request, res: Response) {
    const { email, password }: LoginDto = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login({ email, password });

    setCookie(res, accessToken, refreshToken);
    res.status(200).json({ msg: "로그인이 완료 되었습니다.", user: user, token: accessToken });
  }

  /**
   * @description 사용자 로그아웃
   * @route POST /auth/logout
   *
   * @param {string} req.body.email - 사용자 email
   * @param {string} req.body.password - 사용자 password
   */
  static async logout(req: Request, res: Response) {
    try {
      // 쿠키 삭제
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

      res.status(200).json({ msg: "로그아웃이 완료 되었습니다." });
    } catch (error) {
      return handleError(res, error);
    }
  }
}