// DB 모델, 내부 로직용
export interface User {
  id: number;
  email: string;
  password: string;  // 해시된 값
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}