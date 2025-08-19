import productRepository from "../repositories/product.repository";
import notificationService from "./notification.service";
import { NotificationType } from "@prisma/client";
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from "../utils/dtos/product.dto";

const productService = {
  createProduct: async (userId: number, data: CreateProductDto) => {
    return await productRepository.createProduct(userId, data);
  },

  getAllProducts: async (query: any): Promise<ProductResponseDto[]> => {
    return await productRepository.getAllProducts(query);
  },

  getProductById: async (productId: number): Promise<ProductResponseDto> => {
    return await productRepository.getProductById(productId);
  },

  // 상품 업데이트 (가격 변동)
  updateProduct: async (
    userId: number,
    productId: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> => {
    // 1.업데이트 전 필드 조회
    const before = await productRepository.getProductCoreById(productId);
    if (!before) throw new Error("상품 없음");

    // 2.업데이트 수행
    const updated = await productRepository.updateProduct(
      userId,
      productId,
      data
    );

    // 가격 미포함 업데이트 왔을 때 -> data.price가 없으면 비교 자체를 건너뛰기
    if (data.price === undefined || before.price === updated.price) {
      return updated;
    }

    // 3.가격 변경 감지 → 알림 발송
    if (Number(before.price) !== Number(updated.price)) {
      const likerIds: number[] = await productRepository.findLikerIds(
        updated.id
      );
      console.log("[price-change] likerIds:", likerIds);

      await Promise.all(
        likerIds.map((uid) =>
          notificationService.createAndEmit({
            userId: uid,
            type: NotificationType.PRICE_CHANGE,
            title: "좋아요한 상품의 가격이 변동되었어요",
            message: `${updated.name}: ${before.price} → ${updated.price}`,
            meta: {
              productId: updated.id,
              oldPrice: before.price,
              newPrice: updated.price,
            },
          })
        )
      );
    }

    return updated;
  },

  deleteProduct: async (userId: number, productId: number): Promise<void> => {
    await productRepository.deleteProduct(userId, productId);
  },

  likeProduct: async (userId: number, productId: number) => {
    const existing = await productRepository.hasLikedProduct(userId, productId);
    if (existing) throw new Error("이미 좋아요 했음");
    return await productRepository.likeProduct(userId, productId);
  },

  unlikeProduct: async (userId: number, productId: number) => {
    return await productRepository.unlikeProduct(userId, productId);
  },
};

export default productService;
