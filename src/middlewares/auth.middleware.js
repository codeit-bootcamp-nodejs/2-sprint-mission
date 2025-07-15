//환경변수(.env)에서 JWT_SECRET 로드
import 'dotenv/config';
import { verifyAccessToken } from '../utils/token.js';
import jwt from 'jsonwebtoken';

export default async function authMiddleware(req, res, next) {
  // 1. 토큰 추출 (헤더 또는 쿠키)
  const token = 
  req.headers.authorization?.split(' ')[1] || 
  req.cookies.accessToken;

  // 2. 토큰 존재 여부 확인
  if (!token) {
    return res.status(401).json({ message: '로그인 후 이용해주세요.' });
  }

  try {
    // 3. 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. 검증 성공 시 사용자 정보 저장
    req.user = { userId: decoded.userId, email: decoded.email };
    return next(); // 인증 통과 → 다음 라우터로
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.
      status(401)
      .json({ message: '토큰이 만료되었습니다. 다시 로그인 해주세요.' });
    }
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
  }


  
