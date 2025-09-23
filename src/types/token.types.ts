export interface OptionsType {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: Date;
}

export interface TokenResultType {
  accessToken: string;
  refreshToken: string;
}

export interface UserPayload {
  id: number;
  [key: string]: any;
}

export interface UserType {
  id: number;
  email: string;
  name: string;
  password?: string;
}

export interface UserWithTokenType extends UserType {
  accessToken: string;
  refeshToken: string;
}

export interface UserWithTokenResponseType {
  user: UserWithTokenType;
  message: string;
}

