export interface UserInfoType {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPasswordType extends UserInfoType {
  password: string;
}

export type AuthenticatedUser = Pick<UserInfoType, 'id' | 'email' | 'nickname' | 'image'>;