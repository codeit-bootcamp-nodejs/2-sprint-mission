import { db } from "../lib/db.js";
import { hashPassword } from "../utils/hash.password.js";
import { comparePassword } from "../utils/compare.password.js";
import { generateTokens, verifyRefreshToken } from "../lib/token.js";

// 회원 가입
async function register(req, res, next) {
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
async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error("올바른 이메일이 아닙니다.");
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("비밀번호가 틀렸습니다.");
      error.status = 403;
      throw error;
    }

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

async function refreshAccessToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh Token이 없습니다.");
      error.status = 401;
      return next(error);
    }

    const { userId } = verifyRefreshToken(refreshToken);

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("유저를 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

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
