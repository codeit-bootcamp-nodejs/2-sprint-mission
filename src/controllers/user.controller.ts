
import { getValidatedId } from "../utils/common";
import { Request, Response } from "express";
import UserService from "../services/user.service";
import { UpdateUserDto } from "../dtos/user.dto";

export default class UserController {
  /**
   * @description 사용자 정보 조회 
   * @route GET /users/:id
  *
  * @param {string} req.params.userId - 사용자 id
  */
  static async getUserInfo(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const userInfo = await UserService.getUserInfo(id);
    res.status(200).json(userInfo);
  }
  /**
   * @description 사용자 정보 수정
   * @route PATCH /users/:id/
   *
   * @param {string} req.params.userId - 사용자 id
   * @param {string} req.body.email - 사용자 이메일
   * @param {string} req.body.nickname - 사용자 닉네임
   * @param {string} req.body.image - 사용자 프로필 사진
  */
  static async patchUserInfo(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const body: UpdateUserDto = req.body;
    const userInfo = await UserService.patchUserInfo({ id, body });

    res.status(200).json(userInfo);

  }
  /**
   * @description 사용자 비밀번호 수정
   * @route PATCH /users/:id/password
   *
   * @param {string} req.params.userId - 사용자 id
   * @param {string} req.body.password - 사용자 비밀번호
   */
  static async patchUserPassword(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const { password } = req.body;

    await UserService.patchUserPassword({ id, password });
    res.status(200).json({ msg: "비밀번호가 변경 되었습니다." });

  }

  /**
   * @description 자신이 등록한 상품 목록 조회
   * @route GET /users/:id/products
   *
   * @param {string} req.params.userId - 사용자 id
   */
  static async getProductByUser(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const products = await UserService.getProductByUser(id);
    
    res.status(200).json(products);
  }

  /**
   * @description 자신이 등록한 게시글 목록 조회
   * @route GET /users/:id/articles
   *
   * @param {string} req.params.userId - 사용자 id
   */
  static async getArticleByUser(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const articles = await UserService.getArticleByUser(id);

    res.status(200).json(articles);
  }

  /**
   * @description 좋아요한 상품 목록 조회 가능
   * @route GET /users/:id/like-products
   *
   * @param {string} req.params.userId - 사용자 id
   */
  static async getLikeProductByUser(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const likeProducts = await UserService.getLikeProductByUser(id);

    res.status(200).json(likeProducts);
  }

  /**
   * @description 좋아요한 게시글 목록 조회 가능
   * @route GET /users/:id/like-products
   *
   * @param {string} req.params.userId - 사용자 id
   */
  static async getLikeArticleByUser(req: Request, res: Response) {
    const id = getValidatedId(req.validatedId!);
    const likeArticles = await UserService.getLikeArticleByUser(id);
    
    res.status(200).json(likeArticles);
  }
}