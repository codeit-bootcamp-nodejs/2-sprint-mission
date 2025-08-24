import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';

function authenticate(options = { optional: false }): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken && options.optional) return next();
    if (!accessToken) return next({ status: 401, message: 'Unauthorized' });

    const raw = accessToken;

    const id = Number(raw);
    if (!Number.isFinite(id)) {
      if (options.optional) return next();
      return next({ status: 401, message: 'Invalid user id in token' });
    }

    (req as any).user = { id };
    return next();
  }
};

export default authenticate;
