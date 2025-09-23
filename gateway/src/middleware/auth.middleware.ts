import { Context, Next } from 'koa';
import { verifyAccessToken } from '../utils/jwt.util';
import { errorResponse } from '../utils/response.util';

export async function authMiddleware(ctx: Context, next: Next) {
  // 1. Authorization 헤더 우선 확인
  const authHeader = ctx.headers['authorization'];
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. 없으면 쿠키에서 accessToken 확인
  if (!token) {
    token = ctx.cookies.get('accessToken');
  }

  // 3. 토큰 없으면 거부
  if (!token) {
    ctx.status = 401;
    ctx.body = errorResponse(401, 'Unauthorized');
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    ctx.state.user = payload; // 이후 라우트 핸들러에서 ctx.state.user 사용 가능
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = errorResponse(401, 'Invalid token');
  }
}
