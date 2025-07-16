import { RequestHandler } from "express";
import HttpError from "../types/httpError";
import { UserService } from "../services/user.service";
import { UserUpdateDto, ChangePasswordDto } from "../utils/dtos/users.dto";

// 내 정보 조회
const getUserInfo: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);
    const user = await UserService.getUserInfo(userId);

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// 내 정보 수정
const updateUserInfo: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);
    const { nickname, image } = req.body as UserUpdateDto;

    const updatedInfo = await UserService.updateUserInfo(userId, { nickname, image });

    res.status(200).json({
      message: "유저 정보가 수정되었습니다.",
      user: updatedInfo,
    });
  } catch (err) {
    next(err);
  }
};

// 계정 비밀번호 변경
const changeUserPassword: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);
    const { currentPassword, newPassword } = req.body as ChangePasswordDto;

    await UserService.changeUserPassword(userId, { currentPassword, newPassword });

    res.status(200).json({
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

// 내 상품 조회
const getMyProducts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);
    const products = await UserService.getMyProducts(userId);

    res.status(200).json({ message: "내 상품 목록", products });
  } catch (err) {
    next(err);
  }
};

// 내 좋아요 상품 조회
const getMyProductsLike: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = req.user.id;
    const products = await UserService.getMyProductsLike(userId);

    res.status(200).json({ message: "내 좋아요 상품 목록", products });
  } catch (err) {
    next(err);
  }
};

export {
  getUserInfo,
  updateUserInfo,
  changeUserPassword,
  getMyProducts,
  getMyProductsLike,
};
