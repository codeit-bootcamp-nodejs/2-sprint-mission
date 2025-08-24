import { Request, Response } from 'express';
import { validate } from '../lib/validate';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs';
import * as usersService from '../services/usersService';
import * as authService from '../services/authService';
import userResponseDTO from '../dto/userResponseDTO';
import { assertHasUser } from "../utils/assertHasUser";

// ✅ 이 파일에서만 쓸 가벼운 타입 선언
type UpdateMeBody = { nickname?: string; bio?: string }; // 실제 필드에 맞게 수정
type UpdatePasswordBody = { password: string; newPassword: string };
type GetMyProductListParams = { page?: number; pageSize?: number; orderBy?: string; keyword?: string };
type GetMyFavoriteListParams = { page?: number; pageSize?: number; orderBy?: string; keyword?: string };

export async function getMe(req: Request, res: Response) {
  assertHasUser(req);
  const user = await usersService.getUser(req.user.id);
  res.send(userResponseDTO(user));
}

export async function updateMe(req: Request, res: Response) {
  assertHasUser(req);
  const data = validate<UpdateMeBody>(req.body, UpdateMeBodyStruct);   // 제네릭 추가
  const updatedUser = await usersService.updateUser(req.user.id, data);
  res.status(200).send(userResponseDTO(updatedUser));
}

export async function updateMyPassword(req: Request, res: Response) {
  assertHasUser(req);
  const { password, newPassword } = validate<UpdatePasswordBody>(req.body, UpdatePasswordBodyStruct); // 제네릭 추가
  await authService.updateMyPassword(req.user.id, password, newPassword);
  res.status(200).send();
}

export async function getMyProductList(req: Request, res: Response) {
  assertHasUser(req);
  const { page, pageSize, orderBy, keyword } = validate<GetMyProductListParams>(req.query, GetMyProductListParamsStruct); // 제네릭 추가
  const { list, totalCount } = await usersService.getMyProductList(req.user.id, {
    page,
    pageSize,
    orderBy,
    keyword,
  });

  res.send({
    list,
    totalCount,
  });
}

export async function getMyFavoriteList(req: Request, res: Response) {
  assertHasUser(req);
  const { page, pageSize, orderBy, keyword } = validate<GetMyFavoriteListParams>(req.query, GetMyFavoriteListParamsStruct); // 제네릭 추가
  const { list, totalCount } = await usersService.getMyFavoriteList(req.user.id, {
    page,
    pageSize,
    orderBy,
    keyword,
  });

  res.send({
    list,
    totalCount,
  });
}
