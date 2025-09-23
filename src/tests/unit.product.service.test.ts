// PrismaClient를 모킹해서 DB 없이 비즈니스 로직만 검증
jest.mock('@prisma/client', () => {
  const mPrisma = {
    product: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

import { PrismaClient } from '@prisma/client';
import { ProductService } from '../../src/services/product.service';

const prisma = new (PrismaClient as any)();

describe('ProductService.getProductById (unit)', () => {
  it('computes isLiked and likeCount', async () => {
    prisma.product.findUnique.mockResolvedValue({
      id: 1, name: '상품', description: 'd', price: 1000,
      tags: [], imageUrl: null, ownerId: 1,
      createdAt: new Date(), updatedAt: new Date(),
      likes: [{ userId: 2 }, { userId: 3 }],
    });

    const r = await ProductService.getProductById(1, 2);
    expect(r?.likeCount).toBe(2);
    expect(r?.isLiked).toBe(true);
  });

  it('returns null when not found', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    const r = await ProductService.getProductById(999);
    expect(r).toBeNull();
  });
});
