import Express from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nickname: string;
      image: string | null;
      password: string;
    }

    interface Request {
      user?: User;
    }
  }
}


