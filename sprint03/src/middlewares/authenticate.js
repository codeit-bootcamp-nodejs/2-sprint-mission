import { db } from "../lib/db.js";
import { verifyAccessToken } from "../lib/token.js";

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

// 로그인 여부(토큰) 검사
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    const user = await db.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ message: "인증에 실패했습니다." });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
