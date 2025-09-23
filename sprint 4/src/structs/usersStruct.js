import { object, string } from 'superstruct';

export const CreateUserBodyStruct = object({
  email: string(),
  nickname: string(),
  password: string(),
});

export const LoginUserBodyStruct = object({
  email: string(),
  password: string(),
});
