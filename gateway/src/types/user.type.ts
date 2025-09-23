export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type SignInRequest = Pick<User, 'username' | 'password'>;
export type SignUpRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateUserRequest = Partial<SignUpRequest>;
