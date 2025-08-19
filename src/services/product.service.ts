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

  // 상품 업데이트 : 기존 가격과 달라진 경우에만 가격 변동 로직 실행
  updateProduct: async (
    userId: number,
    productId: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> => {

    // 업데이트 전 정보 조회 : 가격 비교와 권한/메시지 구성을 위해서 id, name, price, userId만 가져옴
    const before = await productRepository.getProductCoreById(productId);
    if (!before) throw new Error("상품 없음");

    // 업데이트 수행 : 작성자만 수정 가능하도록 내부에서 권한 체크 실시, 반환값에는 최신 상품 정보와 likeCount/isLiked 포함됨
    const updated = await productRepository.updateProduct(
      userId,
      productId,
      data
    );

    // 가격 비교 가드 : 요청에 price가 없거나, 업데이트 후 가격이 동일하면 비교/알림 로직 건너뜀
    if (data.price === undefined || before.price === updated.price) {
      return updated;
    }

    // 가격 변경 감지 → 알림 발송
    if (Number(before.price) !== Number(updated.price)) {
      // 해당 상품을 좋아요한 사용자 목록 가져와서
      const likerIds: number[] = await productRepository.findLikerIds(
        updated.id
      );

      //  각 사용자에게 알림 생성 + 실시간 전송 수행
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
