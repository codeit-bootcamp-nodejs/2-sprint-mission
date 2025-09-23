// src/product/service.ts
import {
  PrismaClient,
  type Product as ProductModel,
  type ProductLike,
} from '@prisma/client';
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
  constructor(
    private prisma: PrismaClient,
    private notif: NotificationService
  ) {}

  /** 공개 목록 조회 (테스트의 GET /products 대응) */
  async list(): Promise<ProductModel[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /** 단건 조회 (테스트의 GET /products/:id 대응) */
  async getById(productId: number): Promise<ProductModel | null> {
    if (!Number.isFinite(productId)) throw new Error('INVALID_ID');
    return this.prisma.product.findUnique({ where: { id: productId } });
  }

  /** 상품 생성 (시드/운영 공용) */
  async create(dto: CreateProductDto): Promise<ProductModel> {
    if (dto.price < 0) throw new Error('INVALID_PRICE');
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

  /** 상품 수정 + 🔔 가격 변동 트리거 */
  async update(productId: number, dto: UpdateProductDto): Promise<ProductModel> {
    if (!Number.isFinite(productId)) throw new Error('INVALID_ID');
    if (dto.price !== undefined && dto.price < 0) {
      throw new Error('INVALID_PRICE');
    }

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

  /** 상품 삭제 (테스트의 DELETE /products/:id → 200/204 대응) */
  async remove(productId: number): Promise<void> {
    if (!Number.isFinite(productId)) throw new Error('INVALID_ID');
    // 존재 확인 (없으면 에러로 통일)
    const exists = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!exists) throw new Error('PRODUCT_NOT_FOUND');

    await this.prisma.product.delete({ where: { id: productId } });
  }

  /** 상품 좋아요(중복 방지 upsert) */
  async like(productId: number, userId: number): Promise<ProductLike> {
    if (!Number.isFinite(productId)) throw new Error('INVALID_ID');
    if (!Number.isFinite(userId)) throw new Error('UNAUTHORIZED');

    return this.prisma.productLike.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
  }
}
