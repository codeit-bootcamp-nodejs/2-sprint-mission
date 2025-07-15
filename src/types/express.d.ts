//(Express Request에 user 프로퍼티 추가 등)

//기타 전역 enum·유틸 타입 선언
// src/types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      userId: number;
    }
    interface Request {
      user: User;
    }
  }
}
export {};

