import rateLimit from 'express-rate-limit';

// 로그인 시도 제한 미들웨어
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5분
  max: 5, // 5분 동안 5번의 시도 허용
  message: {
    message: '로그인 시도가 너무 많습니다. 5분 후에 다시 시도해주세요.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
