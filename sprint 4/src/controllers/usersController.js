import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import { LoginUserBodyStruct } from '../structs/usersStruct.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// 로그인
export async function login(req, res, next) {
  try {
    const { email, password } = create(req.body, LoginUserBodyStruct);

    // 2. 유저 조회 (비번 포함)
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        password: true, // 비교용
      }
    });
    if (!user) return res.status(401).json({ message: '잘못된 이메일 혹은 비밀번호입니다.' });

    // 3. 패스워드 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '잘못된 이메일 혹은 비밀번호입니다.' });

    // 4. JWT 발급
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. 응답 (비밀번호 제거)
    const { password: _pw, ...userSafe } = user;
    return res.json({
      accessToken,
      user: userSafe
    });
  } catch (err) {
    next(err);
  }
}

// 내 정보 조회
export async function getMe(req, res, next) {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    if (!user) return res.status(404).json({ message: '유저 정보를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// 내 정보 수정
export async function updateMe(req, res, next) {
  try {
    const { nickname, image } = req.body;
    const user = await prismaClient.user.update({
      where: { id: req.user.userId },
      data: { ...(nickname && { nickname }), ...(image && { image }) },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// 비밀번호 변경
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prismaClient.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: '유저 정보를 찾을 수 없습니다.' });

    // 현재 비번 확인
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: '현재 비밀번호가 올바르지 않습니다.' });

    // 새 비번 해싱 후 저장
    const hashed = await bcrypt.hash(newPassword, 10);
    await prismaClient.user.update({
      where: { id: req.user.userId },
      data: { password: hashed }
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
// 내가 등록한 상품 목록 조회
export async function getMyProducts(req, res, next) {
  try {
    const products = await prismaClient.product.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// 내가 등록한 게시글 목록 조회
export async function getMyArticles(req, res, next) {
  try {
    const articles = await prismaClient.article.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
  } catch (err) {
    next(err);
  }
}
