import { Request, Response, NextFunction } from 'express';

// 상품 검증
export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, tags, imageUrl } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '상품 이름이 유효하지 않습니다.' });
  }
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: '상품 설명이 유효하지 않습니다.' });
  }

  const priceNum = Number(price);
  if (price === undefined || isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: '가격은 0 이상의 숫자여야 합니다.' });
  }

  if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
    return res.status(400).json({ error: '태그는 문자열 배열이어야 합니다.' });
  }

  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
  }

  next();
};

// 게시글 검증
export const validateArticle = (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: '게시물 제목이 유효하지 않습니다.' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: '게시물 내용이 유효하지 않습니다.' });
  }

  next();
};

// 댓글 검증
export const validateComment = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: '댓글 내용이 유효하지 않습니다.' });
  }

  next();
};
// 로그인 검증
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: '이메일이 유효하지 않습니다.' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: '비밀번호가 유효하지 않습니다.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: '비밀번호는 최소 8자 이상이어야 합니다.' });
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).json({ error: '이메일 형식이 올바르지 않습니다.' });
  }
  next();
};
// 회원가입 검증
export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, nickname } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: '이메일이 유효하지 않습니다.' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: '비밀번호가 유효하지 않습니다.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: '비밀번호는 최소 8자 이상이어야 합니다.' });
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).json({ error: '이메일 형식이 올바르지 않습니다.' });
  }
  if (!nickname || typeof nickname !== 'string' || nickname.length < 2 || nickname.length > 20) {
    return res.status(400).json({ error: '닉네임은 2자 이상 20자 이하의 문자열이어야 합니다.' });
  }
  next();
};  