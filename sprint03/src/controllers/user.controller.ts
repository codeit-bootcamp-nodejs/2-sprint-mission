import { db } from "../lib/db";
import { hashPassword } from "../utils/hash.password";
import { comparePassword } from "../utils/compare.password";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


// 내 정보 조회
const getUserInfo: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new HttpError(404);
   
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

// 내 정보 수정
const updateUserInfo: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);
    const { nickname, image } = req.body;

    const updatedInfo = await db.user.update({
      where: { id: userId },
      data: {
        nickname,
        image,
      },
      select: {
        nickname: true,
        image: true,
      },
    });

    res.status(200).json({
      message: "유저 정보가 수정되었습니다.",
      user: updatedInfo,
    });
  } catch (err) {
    next(err);
  }
}

// 계정 비밀번호 변경
const changeUserPassword: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);
    const { currentPassword, newPassword } = req.body;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new HttpError(404);

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) throw new HttpError(401);

    const hashedNewPassword = await hashPassword(newPassword);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (err) {
    next(err);
  }
}

// 내 상품 조회
const getMyProducts: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = Number(req.user.id);

    const products = await db.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        tags: true,
        createdAt: true,
      },
    });

    res.status(200).json({ message: "내 상품 목록", products });
  } catch (err) {
    next(err);
  }
}

// 내 좋아요 상품 조회
const getMyProductsLike: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = req.user.id;

    const likes = await db.productLike.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            tags: true,
            createdAt: true,
          },
        },
      },
    });

    const products = likes.map((like) => like.product);

    res.status(200).json({ message: "내 좋아요 상품 목록", products });
  } catch (err) {
    next(err);
  }
}

export {
  getUserInfo,
  updateUserInfo,
  changeUserPassword,
  getMyProducts,
  getMyProductsLike,
};
