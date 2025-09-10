import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/productService";
import { CreateProductDto, PatchProductDto } from "../dtos/products.dto";
import { plainToInstance } from "class-transformer";

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  //로그인한 사용자의 상품 등록
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const productData = plainToInstance(CreateProductDto, req.body);
      const userId = req.user.id;

      const newProduct = await this.productService.createProduct(
        userId,
        productData
      );
      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Failed to create product:", error);
      next(error);
    }
  };

  //로그인한 사용자의 상품 수정
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const productId = Number(req.params.id);
      const user = req.user.id;
      const updateData = plainToInstance(PatchProductDto, req.body);

      const updatedProduct = await this.productService.updateProduct(
        user,
        productId,
        updateData
      );

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      next(error);
    }
  };

  //로그인한 사용자의 상품 삭제
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const productId = Number(req.params.id);
      const user = req.user.id;

      await this.productService.deleteProduct(user, productId);

      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete product:", error);
      next(error);
    }
  };

  //로그인한 사용자가 작성한 상품 목록
  getMyProductList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user.id;

      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const order = (req.query.order as "newest" | "oldest") || "newest";

      const products = await this.productService.myProducts(user, {
        offset,
        limit,
        order,
      });
      res.status(200).json(products);
    } catch (error) {
      console.error(`Error fetching user's products:`, error);
      next(error);
    }
  };

  // 상품 목록 조회(isLike 추가)
  getProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const user = req.user ? req.user.id : null;

      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const order = (req.query.order as "newest" | "oldest") || "newest";

      const products = await this.productService.getProductList(user, {
        offset,
        limit,
        order,
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching product list with like status:", error);
      next(error);
    }
  };

  //사용자가 좋아요한 상품 목록
  getLikedProductList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;

      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const order = (req.query.order as "newest" | "oldest") || "newest";

      const products = await this.productService.myProductsLiked(userId, {
        offset,
        limit,
        order,
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      next(error);
    }
  };
}
