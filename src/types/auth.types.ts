// JWT 토큰에 들어가는 정보
export interface TokenPayload {
  userId: string;
  email: string;
}

// 로그인 후 req.user에 담기는 정보
export interface LoggedInUser {
  id: string;
  email: string;
  nickname: string;
}
