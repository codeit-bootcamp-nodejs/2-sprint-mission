import { db } from "../utils/db";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { ProductPagination } from "../types/product.types";

export default class ProductRepository {
  /**
 * @description 상품 등록
 */
  static async postProduct({ body, userId }: { body: CreateProductDto, userId: number }) {
    return await db.product.create({ data: { ...body, userId: userId }, });
  }

  /**
   * @description 상품 목록 조회
   */
  static async getProduct({ where, order, skip, take }: ProductPagination) {
    return await db.product.findMany({
      where,
      orderBy: { createdAt: order === 'recent' ? 'desc' : 'asc' },
      skip,
      take,
      include: {
        user: {
          select: { id: true, nickname: true, image: true } // 작성자 정보 포함
        },
        _count: {
          select: { isLiked: true } // 좋아요 수 포함
        }
      }
    });
  }

  /**
   * @description 상품 ID로 상품 조회
  */
  static async getProductById(productId: number) {
    return await db.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: { id: true, nickname: true, image: true } // 작성자 정보 포함
        },
        _count: {
          select: { isLiked: true } // 좋아요 수 포함
        }
      }
    });
  }

  /**
    * @description 상품 정보 수정
   */
  static async patchProduct({ productId, body }: { productId: number, body: UpdateProductDto }) {
    return await db.product.update({
      where: { id: productId },
      data: body,
    });
  }

  /**
  * @description 상품 삭제
  */
  static async deleteProduct(productId: number) {
    await db.product.delete({ where: { id: productId } });
  }

  /**
   * @description 사용자가 등록한 상품 목록 조회
   */
  static async getProductByUser(userId: number) {
    return await db.product.findMany({
      where: { userId }
    });
  }
}
