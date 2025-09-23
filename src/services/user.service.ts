import { NotFoundError } from "../utils/error";
import { hashPassword } from "../utils/password";
import UserRepository from "../repositories/user.repository";
import { UpdateUserDto } from "../dtos/user.dto";
import ProductRepository from "../repositories/product.repository";
import ArticleRepository from "../repositories/article.repository";
import LikeRepository from "../repositories/like.repository";

export default class UserService {
  /**
 * @description 사용자 정보 조회 
 * @route GET /users/:id
*
* @param {string} req.params.userId - 사용자 id
*/
  static async getUserInfo(id: number) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(id);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 사용자 정보에서 비밀번호를 제외하고 반환
    const { password: _, ...userWithoutPassword } = userInfo;
    return userWithoutPassword;
  }

  /**
   * @description 사용자 정보 수정
   */
  static async patchUserInfo({ id, body }: { id: number; body: UpdateUserDto; }) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(id);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 사용자 정보 수정
    const updateUser = await UserRepository.patchUserInfo({ id, body });
    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = updateUser;

    return userWithoutPassword;
  }

  /**
   * @description 사용자 비밀번호 수정
   */
  static async patchUserPassword({ id, password }: { id: number; password: string; }) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(id);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);
    // 사용자 비밀번호 수정
    return await UserRepository.patchUserPassword({ id, password: hashedPassword });
  }

  /**
  * @description 자신이 등록한 상품 목록 조회
  */
  static async getProductByUser(userId: number) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(userId);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 사용자 id로 상품 목록 조회
    return await ProductRepository.getProductByUser(userId);
  }

  /**
   * @description 자신이 등록한 게시글 목록 조회
  */
  static async getArticleByUser(userId: number) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(userId);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 사용자 id로 게시글 목록 조회
    return ArticleRepository.getArticleByUser(userId);
  }

  /**
   * @description 좋아요한 상품 목록 조회 가능
   */
  static async getLikeProductByUser(userId: number) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(userId);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 사용자 id로 좋아요한 상품 목록 조회
    const likes = await LikeRepository.getLikeProductByUser(userId);
    return likes.map(like => like.product); // 상품 정보만 추출
  }


  /**
   * @description 좋아요한 게시글 목록 조회 가능
   */
  static async getLikeArticleByUser(userId: number) {
    // 사용자 id로 사용자 조회
    const userInfo = await UserRepository.findUserById(userId);
    if (!userInfo) throw new NotFoundError("사용자가 존재하지 않습니다.");
    // 사용자 id로 좋아요한 게시글 목록 조회
    const likes = await LikeRepository.getLikeArticleByUser(userId);
    return likes.map(like => like.article); // 상품 정보만 추출
  }
}