// 로그인, 회원가입 등 요청/응답
export interface SignupDTO {
    email: string;
    password: string;
    nickname: string;
}
export interface LoginDTO {
    email: string;
    password: string;
}
export interface UpdateUserDTO {
    nickname?: string;
}
export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string; 
}