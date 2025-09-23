import { create } from"superstruct";
import { handleError } from"../utils/error";
import { CreateArticleDtoStruct } from"../dtos/article.dto";
import { CreateProductDtoStruct } from'../dtos/product.dto';
import { CreateCommentDtoStruct } from'../dtos/comment.dto';
import { CreateUserDtoStruct } from"../dtos/user.dto";
import { NextFunction, Request, Response } from "express";

// 유효한 숫자 ID를 검증하는 미들웨어
export const validateParamId = (req:Request, res:Response, next:NextFunction) => {
  const id = Number(req.params.id || req.params.commentId);

  if (!id || isNaN(id)) return handleError(res, null, '유효하지 않은 ID입니다.', 400);
  req.validatedId = id;

  next();
};

// User의 입력 값을 검증하는 미들웨어
export const validateUser = (req:Request, res:Response, next:NextFunction) => {
  try {
    create(req.body, CreateUserDtoStruct);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
};

// Article의 입력 값을 검증하는 미들웨어
export const validateArticle = (req:Request, res:Response, next:NextFunction) => {
  try {
    create(req.body, CreateArticleDtoStruct);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
}

// Product의 입력 값을 검증하는 미들웨어
export const validateProduct = (req:Request, res:Response, next:NextFunction) => {
  // 타입 변환
  if (typeof req.body.price === 'string') {
    req.body.price = Number(req.body.price);
  }

  try {
    create(req.body, CreateProductDtoStruct);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
}

// Comment의 입력 값을 검증하는 미들웨어
export const validateComment = (req:Request, res:Response, next:NextFunction) => {
  try {
    create(req.body, CreateCommentDtoStruct);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
}
