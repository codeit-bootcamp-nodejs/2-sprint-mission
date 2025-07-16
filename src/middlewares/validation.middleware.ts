import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "유효하지 않은 요청입니다.",
        errors: result.error.flatten().fieldErrors,
      });
      return; 
    }

    req.body = result.data;    // 파싱된 안전한 값만 사용
    next();
  };
};
