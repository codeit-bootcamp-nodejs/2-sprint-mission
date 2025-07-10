import { z } from "zod";

export const updateMyInfoSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다"),
  image: z.string().url("올바른 이미지 주소 형식을 입력해주세요").optional(),
});

export const updateMyPasswordSchema = z.object({
  currentPassword: z.string().min(6, "현재 비밀번호는 6자 이상이어야 합니다"),
  newPassword: z.string().min(6, "새 비밀번호는 6자 이상이어야 합니다"),
});
