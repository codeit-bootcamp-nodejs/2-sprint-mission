import { db } from "../utils/db";
import { verifyAccessToken } from "../lib/token";
import { Request, Response, NextFunction } from "express";

async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const reqHeaders = req.headers.authorization;
  const accessToken = reqHeaders && reqHeaders.startsWith('Bearer ')
    ? reqHeaders.slice(7)
    : null;

  if (!accessToken) {
    res.status(401).json({ message: '만료된 사용자' });
    return;
  }

  try {
    const { userId } = verifyAccessToken(accessToken);

    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(401).json({ message: '유저를 찾을 수 없습니다.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      nickname: user.nickname
    };

    next();
  } catch (error) {
    res.status(401).json({ message: '권한없음' });
    return;
  }
}

export default authenticate;
