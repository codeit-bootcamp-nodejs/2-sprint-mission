// src/product/service.ts
import { PrismaClient, type Product as ProductModel, type ProductLike } from '@prisma/client';
import NotificationService from '../notification/service';

export type CreateProductDto = {
  userId: number;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  images?: string[];
  manufacturer?: string;
};

export type UpdateProductDto = {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
};

export default class ProductService {
  constructor(private prisma: PrismaClient, private notif: NotificationService) {}

  /** 상품 생성 (시드/운영 공용) */
  async create(dto: CreateProductDto): Promise<ProductModel> {
    return this.prisma.product.create({
      data: {
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        tags: dto.tags ?? [],
        images: dto.images ?? [],
        ...(dto.manufacturer ? { manufacturer: dto.manufacturer } : {}),
      },
    });
  }

  /** 상품 좋아요(테스트/도움용): 복합 유니크(userId, productId) 기준 upsert */
  async like(productId: number, userId: number): Promise<ProductLike> {
    return this.prisma.productLike.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
  }

  /** 상품 수정 + 🔔 가격 변동 트리거 */
  async update(productId: number, dto: UpdateProductDto): Promise<ProductModel> {
    const before = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { price: true, name: true },
    });
    if (!before) throw new Error('PRODUCT_NOT_FOUND');

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
        ...(dto.images !== undefined ? { images: dto.images } : {}),
      },
    });

    // 가격 실제 변경 시에만 알림 발송
    if (typeof dto.price === 'number' && dto.price !== before.price) {
      const likers = await this.prisma.productLike.findMany({
        where: { productId },
        select: { userId: true },
      });
      if (likers.length > 0) {
        await this.notif.notifyPriceChanged({
          productId,
          oldPrice: before.price,
          newPrice: dto.price,
          likerUserIds: likers.map((l) => l.userId),
          productName: before.name,
        });
      }
    }

    return updated;
  }
}
