import { Request, Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import { signupBodyStruct, loginBodyStruct } from '../structs/usersStructs';
import { generateTokens } from '../utils/token';
import { userService } from '../service/user.service';

// 1) 회원가입
export async function signup(req: Request, res: Response) {
  const data = create(req.body, signupBodyStruct);
  const { email, nickname, password } = data;

  const result = await userService.signup({ email, nickname, password });
  return res.status(201).json(result);
}

// 2) 로그인
export async function login(req: Request, res: Response) {
  const data = create(req.body, loginBodyStruct);
  const { email, password } = data;

  const result = await userService.login({ email, password });
  return res.status(200).json(result);
}

// 3) 내 정보 조회
export async function getMyProfile(req: Request, res: Response) {
  const userId = req.user.userId;
  const result = await userService.getMyProfile(userId);
  return res.status(200).json(result);
}

// 4) 내 정보 수정
export async function updateMyProfile(req: Request, res: Response) {
  const userId = req.user.userId;
  const updates = req.body;

  const result = await userService.updateMyProfile(userId, updates);
  return res.status(200).json(result);
}

// 5) 회원 탈퇴
export async function deleteUser(req: Request, res: Response) {
  const userId = req.user.userId;
  await prismaClient.user.delete({ where: { id: userId } });
  return res.status(204).end();
}

// 6) 로그아웃
export async function logout(req: Request, res: Response) {
  res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME!);
  res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!);
  return res.status(204).end();
}
