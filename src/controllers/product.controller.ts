import { Request, Response } from 'express';
import { getValidatedId } from '../utils/common';
import { CreateProductDto, ProductListQueryDto, UpdateProductDto } from '../dtos/product.dto';
import productService from '../services/product.service';
import ProductService from '../services/product.service';

export default class ProductController {

  /**
   * @description 상품 등록
   * @route POST /products
   * 
   * @param {string} req.body.name - 상품 이름
   * @param {string} req.body.description - 상품 설명
   * @param {number} req.body.price - 상품 가격
   * @param {Array<string>} req.body.tags - 상품 태그
   * @param {string} req.body.imageUrl - 상품 이미지 URL
   */
  static async postProduct(req: Request, res: Response) {
    const body: CreateProductDto = req.body;
    const userId = req.user ? Number(req.user.id) : null;

    const newProduct = await productService.postProduct({ body, userId });
    res.status(201).json({ newProduct, message: "상품이 등록되었습니다." });

  }

  /**
   * @description 상품 목록 조회
   * @route GET /products
   * 
   * @param {number} req.query.offset - 조회 시작 위치 (기본값: 0)
   * @param {number} req.query.limit - 조회할 상품 수 (기본값: 10)
   * @param {string} req.query.order - 정렬 기준 (기본값: 'recent', 'asc' 또는 'desc')
   * @param {string} req.query.search - 검색어 (상품 이름 또는 설명에 포함된 경우)
   */
  static async getProduct(req: Request, res: Response) {

    const query: ProductListQueryDto = req.query;
    const userId = req.user ? Number(req.user.id) : null;
    const formattedProducts = await productService.getProduct({ query, userId });

    res.status(200).json(formattedProducts);
  };

  /**
    * @description 상품 ID로 상품 조회
    * @route GET /products/:id
    * 
    * @param {number} req.params.id - 조회할 상품 ID
   */
  static async getProductById(req: Request, res: Response) {
    const productId = getValidatedId(req.validatedId!);
    const userId = req.user ? Number(req.user.id) : null;

    // 상품 정보에 좋아요 수 포함
    const formattedProduct = await ProductService.getProductById({
      productId,
      userId
    });
    res.status(200).json(formattedProduct);

  };

  /**
    * @description 상품 정보 수정
    * @route PATCH /products/:id
    * 
    * @param {number} req.params.id - 수정할 상품 ID
    * @param {string} req.body.name - 상품 이름
    * @param {string} req.body.description - 상품 설명
    * @param {number} req.body.price - 상품 가격
    * @param {Array<string>} req.body.tags - 상품 태그
    * @param {string} req.body.imageUrl - 상품 이미지 URL
    */
  static async patchProduct(req: Request, res: Response) {
    const body: UpdateProductDto = req.body;
    const productId = getValidatedId(req.validatedId!);
    const userId = req.user ? Number(req.user.id) : null;


    // 상품이 존재할 경우 업데이트
    const updatedProduct = await ProductService.patchProduct({
      body,
      productId,
      userId
    });
    res.status(200).json(updatedProduct);

  }

  /**
   * @description 상품 삭제
   * @route DELETE /products/:id
   * 
   * @param {number} req.params.id - 삭제할 상품 ID
   */
  static async deleteProduct(req: Request, res: Response) {
    const productId = getValidatedId(req.validatedId!);
    const userId = req.user ? Number(req.user.id) : null;
    // 상품이 존재할 경우 삭제
    await ProductService.deleteProduct({ userId, productId });
    res.status(204).json({ message: '상품이 삭제되었습니다.' });
  };

}