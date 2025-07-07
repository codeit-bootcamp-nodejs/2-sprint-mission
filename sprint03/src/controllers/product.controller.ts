import { db } from "../lib/db";
import { assert } from "superstruct";
import { CreateDto } from "../utils/dtos/products.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


// 상품 목록
const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = "recent" } = req.query;

    const search = String(req.query.search || "");

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where: any = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };

    const products = await db.product.findMany({
      where,
      orderBy: sort === "recent" ? { id: "desc" } : undefined,
      skip,
      take,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "상품 목록 조회 성공",
      page: Number(page),
      pageSize: Number(pageSize),
      products,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 등록
const createProduct: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const { name, description, price, tags } = req.body;

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const newProduct = await db.product.create({
      data: { name, description, price, tags, userId: req.user.id },
    });

    res.status(201).json({
      message: "상품이 등록되었습니다.",
      productId: newProduct.id,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 단일 조회
const getProductById: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const productId = Number(req.params.id);
    const userId = req.user.id;

    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    if (!product) throw new HttpError(404);

    let isLiked = false;

    if (userId) {
      const like = await db.productLike.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      isLiked = !!like;
    }

    res.status(200).json({ product, isLiked });
  } catch (err) {
    next(err);
  }
};

// 상품 변경
const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const id = Number(req.params.id);

    const product = await db.product.findUnique({ where: { id } });

    if (!product) throw new HttpError(404);

    const updateData: Partial<typeof product> = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (tags !== undefined) updateData.tags = tags;

    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: "상품 정보가 수정되었습니다.",
      product: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 삭제
const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await db.product.findUnique({ where: { id } });

    if (!product) throw new HttpError(404);

    await db.product.delete({ where: { id } });

    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요 추가, 삭제
const productLike: RequestHandler = async (req, res, next) => {
  try {
    
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = req.user.id;
    const productId = Number(req.params.id);

    const existingLike = await db.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingLike) {
      await db.productLike.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      res.status(200).json({
        message: "좋아요 취소 완료!",
        liked: false,
        userId,
        productId,
      });
    } else {
      await db.productLike.create({
        data: {
          userId,
          productId,
        },
      });

      res.status(201).json({
        message: "좋아요 완료!",
        liked: true,
        userId,
        productId,
      });
    }
  } catch (err) {
    next(err);
  }
}

export {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
  productLike,
};
