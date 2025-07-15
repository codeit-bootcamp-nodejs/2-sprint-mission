// src/structs/usersStructs.js
import { object, string } from 'superstruct';

// 1) 회원가입 요청 바디 검증
export const signupBodyStruct = object({
  email:    string(),  
  nickname: string(),  
  password: string(),  
});

// 2) 로그인 요청 바디 검증
export const loginBodyStruct = object({
  email:    string(),  
  password: string(),  
});
