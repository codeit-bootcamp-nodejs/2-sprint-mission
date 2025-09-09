// src/routes/user.router.ts
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticate } from '../middlewares/auth';

const prisma = new PrismaClient();
const router = express.Router();

// 1) 내 정보 조회
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// 2) 내 정보 수정
router.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { nickname, image } = req.body as { nickname?: string; image?: string };
    const data: { nickname?: string; image?: string } = {};
    if (nickname !== undefined) data.nickname = nickname;
    if (image !== undefined) data.image = image;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(updated);
  } catch (err) {
    const e = err as Prisma.PrismaClientKnownRequestError;
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'Nickname already exists' });
    }
    next(err);
  }
});

// 3) 비밀번호 변경
router.patch('/me/password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: '기존 비밀번호가 일치하지 않습니다.' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });
    res.json({ message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 4) 내가 등록한 상품 목록
router.get('/me/products', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const products = await prisma.product.findMany({
      where: { ownerId: req.user.id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// 5) 내가 등록한 게시글 목록
router.get('/me/articles', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const articles = await prisma.article.findMany({
      where: { authorId: req.user.id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

// 6) 내가 좋아요한 상품 목록
router.get('/me/liked-products', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const products = await prisma.product.findMany({
      where: { likes: { some: { userId: req.user.id } } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// 7) 내가 좋아요한 게시글 목록
router.get('/me/liked-articles', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const articles = await prisma.article.findMany({
      where: { likes: { some: { userId: req.user.id } } },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

export default router;
