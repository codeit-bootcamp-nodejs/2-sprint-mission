import Express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validatedId?: number;
      relationType?: 'articles' | 'products';
    }
    interface User {
      id: number;
      nickname: string;
      email: string;
      password: string;
      image?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
  namespace jwt {
    interface JwtPayload {
      userId?: number;
    }
  }
}