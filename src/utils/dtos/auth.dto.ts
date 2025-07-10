// 회원가입
export interface RegisterUserDto {
  email: string;
  nickname: string;
  password: string;
}

// 로그인
export interface LoginUserDto {
  email: string;
  password: string;
}

// 회원가입 응답 DTO
export interface RegisterUserResponseDto {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 로그인 응답 DTO
export interface LoginUserResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}
