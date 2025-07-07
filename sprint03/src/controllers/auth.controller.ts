import { db } from "../lib/db";
import { hashPassword } from "../utils/hash.password";
import { comparePassword } from "../utils/compare.password";
import { generateTokens, verifyRefreshToken } from "../lib/token";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


// 회원 가입
const  register: RequestHandler = async (req, res, next) => {
  const { email, password, nickname } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: { email, password: hashedPassword, nickname },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: "가입 완료", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

// 로그인
const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new HttpError(401, "이메일이 틀렸습니다.");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new HttpError(401);

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(200).json({
      message: "로그인 성공",
      accesstoken: accessToken,
      refreshtoken: refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// 토큰 재 발급
const refreshAccessToken: RequestHandler =  async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw new HttpError(401, "Refresh Token이 없습니다.");

    const { userId } = verifyRefreshToken(refreshToken);

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new HttpError(404);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id
    );

    res.status(200).json({
      messege: "토큰 재발급 완료.",
      accesstoken: accessToken,
      refreshtoken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
}
export { register, login, refreshAccessToken };
