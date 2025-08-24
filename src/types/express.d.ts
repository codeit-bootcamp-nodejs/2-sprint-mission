import Express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user?: { id: number };
      };
    }
  }
}

export { };