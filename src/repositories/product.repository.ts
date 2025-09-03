import db from "../config/db";
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from "../utils/dtos/product.dto";

const productRepository = {
  createProduct: async (
    userId: number,
    data: CreateProductDto
  ): Promise<ProductResponseDto> => {
    const product = await db.product.create({
      data: {
        ...data,
        userId,
      },
    });

    const result: ProductResponseDto = {
      ...product,
      likeCount: 0,
      isLiked: false,
    };

    return result;
  },

  getAllProducts: async (query: any): Promise<ProductResponseDto[]> => {
    const skip = Number(query.skip) || 0;
    const take = Number(query.limit) || 10;
    const keyword = query.keyword?.toString() ?? "";

    const products = await db.product.findMany({
      where: {
        name: { contains: keyword },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    const result: ProductResponseDto[] = await Promise.all(
      products.map(async (product: any) => {
        const likeCount = await db.productLike.count({
          where: { productId: product.id },
        });

        // 목록 조회에서는 isLiked를 false 처리하거나 조건부 계산
        return {
          ...product,
          likeCount,
          isLiked: false,
        };
      })
    );

    return result;
  },

  getProductById: async (
    productId: number,
    userId?: number
  ): Promise<ProductResponseDto> => {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    const likeCount = await db.productLike.count({ where: { productId } });

    let isLiked = false;
    if (userId) {
      const liked = await db.productLike.findFirst({
        where: { userId, productId },
      });
      isLiked = !!liked;
    }

    return {
      ...product,
      likeCount,
      isLiked,
    };
  },

  updateProduct: async (
    userId: number,
    productId: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> => {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("상품 없음");
    }

    if (product.userId !== userId) {
      const error = new Error("작성자만 수정 가능");
      (error as any).status = 403;
      throw error;
    }

    const updated = await db.product.update({
      where: { id: productId },
      data,
    });

    const likeCount = await db.productLike.count({ where: { productId } });

    const liked = await db.productLike.findFirst({
      where: { userId, productId },
    });

    return {
      ...updated,
      likeCount,
      isLiked: !!liked,
    };
  },

  deleteProduct: async (userId: number, productId: number): Promise<void> => {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("상품 없음");
    }

    if (product.userId !== userId) {
      const error = new Error("작성자만 삭제 가능");
      (error as any).status = 403;
      throw error;
    }

    await db.product.delete({ where: { id: productId } });
  },

  likeProduct: async (userId: number, productId: number) => {
    return await db.productLike.create({
      data: {
        userId,
        productId,
      },
    });
  },

  unlikeProduct: async (userId: number, productId: number) => {
    // 동일 조합이 중복으로 들어갔을 가능성까지 안전하게 지우려면 deleteMany가 더 멱등적임
    return await db.productLike.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  },

  hasLikedProduct: async (userId: number, productId: number) => {
    return await db.productLike.findFirst({
      where: {
        userId,
        productId,
      },
    });
  },

  // 업데이트 전 가격 비교 조회 : 가격 비교, 메시지 구성에 필요한 필드만 select로 가져옴
  getProductCoreById: async (
    productId: number
  ): Promise<{
    id: number;
    name: string;
    price: number;
    userId: number;
  } | null> => {
    return await db.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, userId: true },
    });
  },

  // 좋아요한 사용자 목록
  findLikerIds: async (productId: number): Promise<number[]> => {
    const likes = await db.productLike.findMany({
      where: { productId },
      select: { userId: true },
    });
    return likes.map((l) => l.userId);
  },
};

export default productRepository;
