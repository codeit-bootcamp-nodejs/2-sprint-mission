import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from "../utils/dtos/product.dto";

const productController = {
  // 상품 등록
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      // ▽ 파일이 왔으면 URL 만들기 (prod: multer-s3, dev: disk)
      const f: any = req.file;
      let imageUrl: string | undefined = req.body.imageUrl;
      if (f) {
        imageUrl = f.location ?? `/uploads/${f.filename}`;
      }

      const data: CreateProductDto = { ...req.body, imageUrl };
      const result: ProductResponseDto = await productService.createProduct(
        userId,
        data
      );

      res.status(201).json({ message: "등록 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // 전체 상품 목록 조회
  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: ProductResponseDto[] = await productService.getAllProducts(
        req.query
      );

      res.status(200).json({ message: "상품 목록", result });
    } catch (error) {
      next(error);
    }
  },

  // 상품 상세 조회
  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const result: ProductResponseDto = await productService.getProductById(
        productId
      );

      res.status(200).json({ message: "개별 상품", result });
    } catch (error) {
      next(error);
    }
  },

  // 상품 수정
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);

      const f: any = req.file;
      let imageUrl: string | undefined = req.body.imageUrl;
      if (f) {
        imageUrl = f.location ?? `/uploads/${f.filename}`;
      }

      const data: UpdateProductDto = { ...req.body, imageUrl };

      const result: ProductResponseDto = await productService.updateProduct(
        userId,
        productId,
        data
      );

      res.status(200).json({ message: "수정 완료", result });
    } catch (error) {
      next(error);
    }
  },

  // 상품 삭제
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);
      await productService.deleteProduct(userId, productId);
      res.status(200).json({ message: "삭제 완료" });
    } catch (error) {
      next(error);
    }
  },

  // 좋아요
  likeProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);
      const result = await productService.likeProduct(userId, productId);

      res.status(200).json({ message: "좋아요", result });
    } catch (error) {
      next(error);
    }
  },

  // 좋아요 취소
  unlikeProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);
      await productService.unlikeProduct(userId, productId);

      res.status(200).json({ message: "좋아요 취소" });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
