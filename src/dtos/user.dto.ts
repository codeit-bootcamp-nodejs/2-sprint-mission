import { string, optional, object } from 'superstruct';

export var CreateUserDtoStruct = object({
  email: string(),
  nickname: string(),
  image: optional(string()),
  password: string(),
})

export interface CreateUserDto {
  email: string;
  nickname: string;
  image?: string;
  password: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;

