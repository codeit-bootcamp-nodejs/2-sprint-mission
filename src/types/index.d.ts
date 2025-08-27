import { User } from "@prisma/client";
import "socket.io";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nickname: string;
      password: string;
      image: string | null;
      refreshToken: string | null;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: User;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    data: {
      userId?: number;
    };
  }
}

export {};
