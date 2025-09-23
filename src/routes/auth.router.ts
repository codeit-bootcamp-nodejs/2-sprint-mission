import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  verifyRefresh,
  revokeRefreshToken,
} from '../utils/token';

const prisma = new PrismaClient();

const router: express.Router = express.Router();

// Request body 타입 정의
interface RegisterRequestBody {
  email: string;
  password: string;
  nickname: string;
  image?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// 공통 유효성 검사 미들웨어 
function checkCredentials(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'POST') return next();
  const body = (req.body ?? {}) as Partial<RegisterRequestBody & LoginRequestBody>;
  const { email, password, nickname } = body;
  const isRegister = req.path === '/register' || req.originalUrl.endsWith('/register');

  if (!email || !password || (isRegister && !nickname)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
}

// 회원가입
router.post('/register', checkCredentials, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, nickname, password, image } = req.body as RegisterRequestBody;

    const hashed = await bcrypt.hash(password, 12);

    const data: Prisma.UserCreateInput = {
      email,
      nickname,
      password: hashed,
    };
    if (typeof image === 'string' && image.trim() !== '') {
      data.image = image.trim();
    }

    const user = await prisma.user.create({
      data,
      select: { id: true, email: true, nickname: true },
    });

    return res.status(201).json(user);
  } catch (err: any) {

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ message: 'Email or nickname already exists' });
    }
    
    if (err instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ message: 'Validation failed', detail: err.message });
    }
    next(err);
  }
});

// 로그인
router.post('/login', checkCredentials, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginRequestBody = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });
    await persistRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

// Access Token 재발급 (Promise.any 제거)
router.post('/token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

  try {
    const payload = verifyRefresh(refreshToken) as { id: number };

    const stored = await prisma.refreshToken.findMany({ where: { userId: payload.id } });

    const results = await Promise.allSettled(
      stored.map((r) => bcrypt.compare(refreshToken, r.tokenHash))
    );

    const stillValid = results.some(
      (result): result is PromiseFulfilledResult<boolean> =>
        result.status === 'fulfilled' && result.value === true
    );

    if (!stillValid) throw new Error('Revoked or not found');

    const newAccess = signAccessToken({ id: payload.id });
    return res.json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// 로그아웃
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;