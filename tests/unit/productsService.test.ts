import { faker } from '@faker-js/faker';
import * as productsService from '../../src/services/productsService';
import * as productsRepository from '../../src/repositories/productsRepository';
import * as favoritesRepository from '../../src/repositories/favoritesRepository';
import * as notificationsService from '../../src/services/notificationsService';
import NotFoundError from '../../src/lib/errors/NotFoundError';
import ForbiddenError from '../../src/lib/errors/ForbiddenError';

// Repository와 Service 모킹
jest.mock('../../src/repositories/productsRepository');
jest.mock('../../src/repositories/favoritesRepository');
jest.mock('../../src/services/notificationsService');

describe('ProductsService', () => {
  // 각 테스트 전에 모든 모킹 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product and return it with default counts', async () => {
      const productData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: 10000,
        tags: ['electronics'],
        images: [faker.image.url()],
        userId: 1,
      };

      const createdProduct = {
        id: 1,
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.createProduct as jest.Mock).mockResolvedValue(createdProduct);

      const result = await productsService.createProduct(productData);

      expect(productsRepository.createProduct).toHaveBeenCalledWith(productData);
      expect(productsRepository.createProduct).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...createdProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
    });
  });

  describe('getProduct', () => {
    it('should return product with favorites info', async () => {
      const product = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10000,
        tags: ['test'],
        images: ['test.jpg'],
        userId: 1,
        favoriteCount: 5,
        isFavorited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(product);

      const result = await productsService.getProduct(1);

      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundError if product does not exist', async () => {
      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(null);

      await expect(productsService.getProduct(999)).rejects.toThrow(NotFoundError);
      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(999);
    });
  });

  describe('updateProduct', () => {
    const existingProduct = {
      id: 1,
      name: 'Original Product',
      description: 'Original Description',
      price: 10000,
      tags: ['original'],
      images: ['original.jpg'],
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update product if user is owner', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 20000,
        userId: 1,
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateData,
        favoriteCount: 3,
        isFavorited: false,
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        updatedProduct,
      );
      (favoritesRepository.getFavoritesByProductId as jest.Mock).mockResolvedValue([]);

      const result = await productsService.updateProduct(1, updateData);

      expect(productsRepository.getProduct).toHaveBeenCalledWith(1);
      expect(productsRepository.updateProductWithFavorites).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw ForbiddenError if user is not owner', async () => {
      const updateData = {
        name: 'Hacked Product',
        userId: 2, // 다른 사용자
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);

      await expect(productsService.updateProduct(1, updateData)).rejects.toThrow(ForbiddenError);

      expect(productsRepository.updateProductWithFavorites).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if product does not exist', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);

      await expect(productsService.updateProduct(999, { userId: 1 })).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should send notifications when price changes', async () => {
      const updateData = {
        price: 5000, // 가격 변경
        userId: 1,
      };

      const updatedProduct = {
        ...existingProduct,
        price: updateData.price,
        favoriteCount: 2,
        isFavorited: false,
      };

      const mockFavorites = [
        { id: 1, productId: 1, userId: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, productId: 1, userId: 3, createdAt: new Date(), updatedAt: new Date() },
      ];

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        updatedProduct,
      );
      (favoritesRepository.getFavoritesByProductId as jest.Mock).mockResolvedValue(mockFavorites);

      // Spy를 사용하여 createAndSendNotification 호출 감시
      const notificationSpy = jest.spyOn(notificationsService, 'createAndSendNotification');

      const result = await productsService.updateProduct(1, updateData);

      expect(favoritesRepository.getFavoritesByProductId).toHaveBeenCalledWith(1);
      expect(notificationSpy).toHaveBeenCalledTimes(2); // 2명의 사용자에게 알림

      // 첫 번째 알림 확인
      expect(notificationSpy).toHaveBeenCalledWith({
        type: 'PRICE_CHANGE',
        message: expect.stringContaining('10000원에서 5000원으로 변경'),
        userId: 2,
        relatedId: 1,
      });

      // 두 번째 알림 확인
      expect(notificationSpy).toHaveBeenCalledWith({
        type: 'PRICE_CHANGE',
        message: expect.stringContaining('10000원에서 5000원으로 변경'),
        userId: 3,
        relatedId: 1,
      });

      expect(result).toEqual(updatedProduct);
    });

    it('should not send notifications when price does not change', async () => {
      const updateData = {
        name: 'Updated Name', // 이름만 변경
        userId: 1,
      };

      const updatedProduct = {
        ...existingProduct,
        name: updateData.name,
        favoriteCount: 2,
        isFavorited: false,
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        updatedProduct,
      );

      const notificationSpy = jest.spyOn(notificationsService, 'createAndSendNotification');

      await productsService.updateProduct(1, updateData);

      expect(favoritesRepository.getFavoritesByProductId).not.toHaveBeenCalled();
      expect(notificationSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete product if user is owner', async () => {
      const product = {
        id: 1,
        name: 'Test Product',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(product);
      (productsRepository.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      await productsService.deleteProduct(1, 1);

      expect(productsRepository.getProduct).toHaveBeenCalledWith(1);
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenError if user is not owner', async () => {
      const product = {
        id: 1,
        name: 'Test Product',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(product);

      await expect(productsService.deleteProduct(1, 2)).rejects.toThrow(ForbiddenError);

      expect(productsRepository.deleteProduct).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if product does not exist', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);

      await expect(productsService.deleteProduct(999, 1)).rejects.toThrow(NotFoundError);

      expect(productsRepository.deleteProduct).not.toHaveBeenCalled();
    });
  });

  describe('getProductList', () => {
    it('should return paginated product list', async () => {
      const mockProducts = {
        list: [
          {
            id: 1,
            name: 'Product 1',
            price: 10000,
            favoriteCount: 5,
            isFavorited: false,
          },
          {
            id: 2,
            name: 'Product 2',
            price: 20000,
            favoriteCount: 3,
            isFavorited: true,
          },
        ],
        totalCount: 2,
      };

      (productsRepository.getProductListWithFavorites as jest.Mock).mockResolvedValue(mockProducts);

      const params = { page: 1, pageSize: 10 };
      const result = await productsService.getProductList(params, { userId: 1 });

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(params, {
        userId: 1,
      });
      expect(result).toEqual(mockProducts);
    });

    it('should work without userId', async () => {
      const mockProducts = {
        list: [],
        totalCount: 0,
      };

      (productsRepository.getProductListWithFavorites as jest.Mock).mockResolvedValue(mockProducts);

      const params = { page: 1, pageSize: 10 };
      const result = await productsService.getProductList(params);

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(params, {
        userId: undefined,
      });
      expect(result).toEqual(mockProducts);
    });
  });
});
