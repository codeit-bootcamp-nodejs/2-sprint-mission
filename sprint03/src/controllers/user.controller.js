import { db } from "../lib/db.js";
import { hashPassword } from "../utils/hash.password.js";
import { comparePassword } from "../utils/compare.password.js";

async function getUserInfo(req, res, next) {
  try {
    const userId = Number(req.user.id);

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    const { password: _, ...userWithoutPassword } = user;

    if (!user) {
      const error = new Error("유저를 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

async function updateUserInfo(req, res, next) {
  try {
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

async function changeUserPassword(req, res, next) {
  try {
    const userId = Number(req.user.id);
    const { currentPassword, newPassword } = req.body;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("유저를 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      const error = new Error("비밀번호가 올바르지 않습니다.");
      error.status = 403;
      return next(error);
    }

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

async function getMyProducts(req, res, next) {
  try {
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

async function getMyProductsLike(req, res, next) {
  try {
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

    return res.status(200).json({ message: "내 좋아요 상품 목록", products });
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
