import { jest } from '@jest/globals';
import ProductService from '../../product/service';
import type { Product } from '@prisma/client';

// --- Mock objects -----------------------------------------------------------
type MockedPrisma = {
  product: {
    create: jest.MockedFunction<(args: any) => Promise<Product>>;
    findUnique: jest.MockedFunction<(args: any) => Promise<any>>;
    update: jest.MockedFunction<(args: any) => Promise<Product>>;
  };
  productLike: {
    findMany: jest.MockedFunction<(args: any) => Promise<{ userId: number }[]>>;
  };
};

type MockedNotif = {
  notifyPriceChanged: jest.MockedFunction<(payload: any) => void>;
};

describe('ProductService (unit)', () => {
  let prisma: MockedPrisma;
  let notif: MockedNotif;
  let svc: ProductService;

  beforeEach(() => {
    prisma = {
      product: {
        create: jest.fn() as any,
        findUnique: jest.fn() as any,
        update: jest.fn() as any,
      },
      productLike: {
        findMany: jest.fn() as any, // ✅ 추가
      },
    };

    notif = {
      notifyPriceChanged: jest.fn() as any,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    svc = new ProductService(prisma, notif);
    jest.clearAllMocks();
  });

  test('create: userId + dto로 상품을 생성한다', async () => {
    const dto = {
      userId: 1,
      name: '테스트상품',
      description: 'desc',
      price: 1000,
      tags: [] as string[],
      images: [] as string[],
    };

    const created: Product = {
      id: 10,
      userId: dto.userId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      tags: dto.tags,
      images: dto.images,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.product.create.mockResolvedValue(created);

    const result = await svc.create(dto);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: { ...dto },
    });
    expect(result).toEqual(created);
  });

  test('update: 존재하지 않는 상품이면 PRODUCT_NOT_FOUND 에러를 던진다', async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    await expect(svc.update(999, { price: 2000 })).rejects.toThrow('PRODUCT_NOT_FOUND');
  });

  test('update: 가격이 바뀌면 notifyPriceChanged 호출', async () => {
    const id = 11;
    const before = { price: 1000, name: '상품' };
    prisma.product.findUnique.mockResolvedValue(before);
    prisma.product.update.mockResolvedValue({
      id,
      userId: 1,
      name: '상품',
      description: 'new',
      price: 2000,
      tags: [] as string[],
      images: [] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    prisma.productLike.findMany.mockResolvedValue([{ userId: 1 }]); // ✅ liker 1명 존재

    const result = await svc.update(id, { description: 'new', price: 2000 });

    expect(result.price).toBe(2000);
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id },
      data: { description: 'new', price: 2000 },
    });
    expect(notif.notifyPriceChanged).toHaveBeenCalledTimes(1);
    expect(notif.notifyPriceChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: id,
        oldPrice: 1000,
        newPrice: 2000,
        likerUserIds: [1],
        productName: '상품',
      }),
    );
  });

  test('update: 가격이 동일하면 notifyPriceChanged 미호출', async () => {
    const id = 12;
    const before = { price: 3000, name: '상품' };
    prisma.product.findUnique.mockResolvedValue(before);
    prisma.product.update.mockResolvedValue({
      id,
      userId: 2,
      name: '상품',
      description: 'same',
      price: 3000,
      tags: [] as string[],
      images: [] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    prisma.productLike.findMany.mockResolvedValue([{ userId: 1 }]);

    await svc.update(id, { description: 'same', price: 3000 });

    expect(prisma.product.update).toHaveBeenCalledTimes(1);
    expect(notif.notifyPriceChanged).not.toHaveBeenCalled();
  });
});
