import { assert } from "superstruct";
import { CreateDto, ProductCreateDto, ProductUpdateDto } from "../utils/dtos/products.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";
import { ProductService } from "../services/product.service";

// 상품 목록
const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const result = await ProductService.getProducts(req.query);
    res.status(200).json({
      message: "상품 목록 조회 성공",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 등록
const createProduct: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const { name, description, price, tags } = req.body as ProductCreateDto;

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const newProduct = await ProductService.createProduct(
      { name, description, price, tags },
      req.user.id
    );

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

    const { product, isLiked } = await ProductService.getProductById(
      Number(req.params.id),
      req.user.id
    );

    res.status(200).json({ product, isLiked });
  } catch (err) {
    next(err);
  }
};

// 상품 변경
const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, price, tags } =
      req.body as ProductUpdateDto;

    const updatedProduct = await ProductService.updateProduct(
      Number(req.params.id),
      { name, description, price, tags }
    );

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
    await ProductService.deleteProduct(Number(req.params.id));
    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요 추가, 삭제
const productLike: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const result = await ProductService.toggleProductLike(
      req.user.id,
      Number(req.params.id)
    );

    res.status(result.liked ? 201 : 200).json(result);
  } catch (err) {
    next(err);
  }
};

export {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
  productLike,
};
