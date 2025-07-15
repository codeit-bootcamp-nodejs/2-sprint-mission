// 회원가입 요청
export interface SignupDTO {
  email: string;
  nickname: string;
  password: string;
}

// 로그인 요청
export interface LoginDTO {
  email: string;
  password: string;
}

// 로그인 성공 시 응답
export interface AuthResponseDTO {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}
