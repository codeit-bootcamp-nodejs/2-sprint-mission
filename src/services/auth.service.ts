import { AuthenticationError, AuthorizationError, NotFoundError, ValidationError } from "../utils/error";
import UserRepository from "../repositories/user.repository";
import { comparePassword, hashPassword } from "../utils/password";
import { db } from "../utils/db";
import { createToken, setCookie } from "../utils/token";
import { CreateUserDto } from "../dtos/user.dto";

export default class AuthService {
  /**
   * @description 사용자 회원가입
   */
  static async register(body: CreateUserDto) {
    const { email, password } = body;
    // 이메일 중복 검사
    const duplicateEmail = await UserRepository.findUserByEmail(email);
    if (duplicateEmail) throw new ValidationError("이미 존재하는 이메일입니다.");
    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);
    // 사용자 등록
    const newUser = await UserRepository.createUser({ ...body, password: hashedPassword });
    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

  /**
   * @description 사용자 로그인
   */
  static async login({ email, password }: { email: string, password: string }) {
    // email로 사용자 조회
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError("존재하지 않는 사용자입니다.");
    // 비밀번호 검증
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new ValidationError("비밀번호가 일치하지 않습니다.");

    const { accessToken, refreshToken } = createToken(user);
    if (!accessToken) throw new AuthenticationError("토큰 생성에 실패했습니다.");


    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
}