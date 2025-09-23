import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { db } from "../utils/db";

export default class UserRepository {
  /**
   * @description 사용자 회원가입
   */
  static async createUser(body: CreateUserDto) {
    return await db.user.create({
      data: body,
    });
  }

  /**
   * @description 사용자 Id를 통해 사용자 DB 정보 조회 
   */
  static async findUserById(id: number) {
    return await db.user.findUnique({ where: { id } });
  }

    /**
   * @description 사용자 Id를 통해 사용자 DB 정보 조회 
   */
  static async findUserByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  }

  /**
   * @description 사용자 정보 수정
   */
  static async patchUserInfo({ id, body }: { id: number; body: UpdateUserDto; }) {
    return await db.user.update({
      where: { id },
      data: body,
    })
  }

  /**
   * @description 사용자 비밀번호 수정
   */
  static async patchUserPassword({ id, password }: { id: number; password: string; }) {
    return await db.user.update({
      where: { id },
      data: { password},
    });
  }
}