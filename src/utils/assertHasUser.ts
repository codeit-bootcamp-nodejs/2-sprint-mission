// src/utils/assertHasUser.ts
import { Request } from "express";

// 타입 가드: req.user가 반드시 존재한다고 TS에 증명해줌
export function assertHasUser(
    req: Request
): asserts req is Request & { user: { id: number } } {
    if (!req.user) {
        const error = new Error("Login required");
        (error as any).status = 401; // 에러 핸들러에서 401로 처리할 수 있게 표시
        throw error;
    }
}
