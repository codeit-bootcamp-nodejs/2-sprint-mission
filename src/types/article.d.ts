import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  nickname: string;
  image: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateOrUpdateArticle {
  title: string;
  content: string;
};

declare global {
  namespace Express {
    interface Request {
      user: Pick<User, 'id' | 'email' | 'nickname'>;
    }
  }
}

export type createArticle = {
  title: string;
  content: string;
  userId: number;
}

