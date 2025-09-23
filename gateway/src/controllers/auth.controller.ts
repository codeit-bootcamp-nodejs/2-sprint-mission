import { Context } from 'koa';
import { signup, signin, refresh, getUserById } from '../services/auth.service';
import { SignInRequest, SignUpRequest } from '../types/user.type';
import { errorResponse, successResponse } from '../utils/response.util';
import { RefreshRequest } from '../types/auth.type';

export async function handleSignUp(ctx: Context) {
  const { username, password } = ctx.request.body as SignUpRequest;

  if (!username || !password) {
    ctx.throw(400, 'Username and password are required');
  }

  const result = await signup(username, password);
  ctx.status = 201;
  ctx.body = successResponse(result);
}

export async function handleSignIn(ctx: Context) {
  const { username, password } = ctx.request.body as SignInRequest;

  if (!username || !password) {
    ctx.throw(400, 'Username and password are required');
  }

  const result = await signin(username, password);

  ctx.set('Authorization', `Bearer ${result.accessToken}`);

  const isProduction = process.env.NODE_ENV === 'production';

  ctx.cookies.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  ctx.cookies.set('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  ctx.status = 200;
  ctx.body = successResponse(result);
}

export async function handleRefresh(ctx: Context) {
  const { refreshToken } = ctx.request.body as RefreshRequest;
  if (!refreshToken) {
    ctx.status = 400;
    ctx.body = errorResponse(400, 'Refresh token is required');
    return;
  }

  try {
    const tokens = await refresh(refreshToken);

    const isProduction = process.env.NODE_ENV === 'production';

    ctx.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    ctx.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    ctx.status = 200;
    ctx.body = successResponse(tokens);
  } catch (err) {
    ctx.status = 401;
    ctx.body = errorResponse(401, (err as Error).message);
  }
}

export async function handleMe(ctx: Context) {
  try {
    const userId = ctx.state.user?.id;
    if (!userId) {
      ctx.status = 401;
      ctx.body = errorResponse(401, 'Unauthorized');
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = errorResponse(404, 'User not found');
      return;
    }

    ctx.status = 200;
    ctx.body = successResponse({
      id: user.id,
      username: user.username,
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = errorResponse(500, (err as Error).message);
  }
}
