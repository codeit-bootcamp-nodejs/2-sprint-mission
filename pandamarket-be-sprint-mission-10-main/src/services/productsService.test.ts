import * as productsRepository from '../repositories/productsRepository';
import * as favoritesRepository from '../repositories/favoritesRepository';
import * as notificationsService from './notificationsService';
import * as productsService from './productsService';
import { NotificationType } from '../types/Notification';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

jest.mock('../repositories/productsRepository');
jest.mock('../repositories/favoritesRepository');
jest.mock('./notificationsService');

describe('상품 서비스', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'desc',
    price: 1000,
    tags: ['tag'],
    images: ['img.jpg'],
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteCount: 0,
    isFavorited: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('상품을 생성할 수 있다', async () => {
      jest.mocked(productsRepository.createProduct).mockResolvedValue(mockProduct);

      const result = await productsService.createProduct({
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        tags: mockProduct.tags,
        images: mockProduct.images,
        userId: mockProduct.userId,
      });

      expect(productsRepository.createProduct).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
    });
  });

  describe('getProduct', () => {
    test('상품이 존재할 때 상품 정보를 반환해야 한다', async () => {
      jest.mocked(productsRepository.getProductWithFavorites).mockResolvedValue({
        ...mockProduct,
        favorites: undefined,
        favoriteCount: 0,
        isFavorited: false,
      });

      const result = await productsService.getProduct(1);

      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        ...mockProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
    });

    test('상품이 존재하지 않을 때 NotFoundError를 반환해야 한다', async () => {
      jest.mocked(productsRepository.getProductWithFavorites).mockResolvedValue(null);

      await expect(productsService.getProduct(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getProductList', () => {
    test('상품 목록을 조회할 수 있다', async () => {
      const mockList = { list: [mockProduct], totalCount: 1 };
      jest.mocked(productsRepository.getProductListWithFavorites).mockResolvedValue({
        ...mockList,
        list: mockList.list.map((product, i) => ({
          ...product,
          favorites: undefined,
          favoriteCount: i,
          isFavorited: false,
        })),
      });

      const result = await productsService.getProductList({ page: 1, pageSize: 10 }, { userId: 1 });

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockList,
        list: mockList.list.map((product, i) => ({
          ...product,
          favorites: undefined,
          favoriteCount: i,
          isFavorited: false,
        })),
      });
    });
  });

  describe('updateProduct', () => {
    test('상품 가격이 변경되면 알림을 보내야 한다', async () => {
      const oldProduct = { ...mockProduct, price: 1000 };
      const updatedProduct = { ...mockProduct, price: 2000, favorites: [{ userId: 2 }] };

      jest.mocked(productsRepository.getProduct).mockResolvedValue(oldProduct);
      jest.mocked(productsRepository.updateProductWithFavorites).mockResolvedValue({
        ...updatedProduct,
        favorites: undefined,
        favoriteCount: 1,
        isFavorited: false,
      });
      jest
        .mocked(favoritesRepository.getFavoritesByProductId)
        .mockResolvedValue([
          { id: 1, productId: 1, userId: 2, createdAt: new Date(), updatedAt: new Date() },
        ]);
      jest.mocked(notificationsService.createNotifications).mockResolvedValue(undefined);

      const result = await productsService.updateProduct(1, { userId: 1, price: 2000 });

      expect(productsRepository.getProduct).toHaveBeenCalledWith(1);
      expect(productsRepository.updateProductWithFavorites).toHaveBeenCalled();
      expect(favoritesRepository.getFavoritesByProductId).toHaveBeenCalledWith(1);
      expect(notificationsService.createNotifications).toHaveBeenCalledWith([
        {
          userId: 2,
          type: NotificationType.PRICE_CHANGED,
          payload: { productId: 1, price: 2000 },
        },
      ]);
      expect(result).toMatchObject({
        ...updatedProduct,
        favorites: undefined,
        favoriteCount: 1,
        isFavorited: false,
      });
    });

    test('상품이 존재하지 않을 때 NotFoundError를 반환해야 한다', async () => {
      jest.mocked(productsRepository.getProduct).mockResolvedValue(null);

      await expect(productsService.updateProduct(1, { userId: 1 })).rejects.toThrow(NotFoundError);
    });

    test('상품 소유자가 아닐 때 ForbiddenError를 반환해야 한다', async () => {
      jest.mocked(productsRepository.getProduct).mockResolvedValue({ ...mockProduct, userId: 2 });

      await expect(productsService.updateProduct(1, { userId: 1 })).rejects.toThrow(ForbiddenError);
    });
  });

  describe('deleteProduct', () => {
    test('상품 소유자가 상품을 삭제할 수 있다', async () => {
      jest.mocked(productsRepository.getProduct).mockResolvedValue(mockProduct);
      jest.mocked(productsRepository.deleteProduct).mockResolvedValue(mockProduct);

      await productsService.deleteProduct(1, 1);

      expect(productsRepository.getProduct).toHaveBeenCalledWith(1);
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith(1);
    });

    test('상품이 존재하지 않을 때 NotFoundError를 반환해야 한다', async () => {
      jest.mocked(productsRepository.getProduct).mockResolvedValue(null);

      await expect(productsService.deleteProduct(1, 1)).rejects.toThrow(NotFoundError);
    });

    test('상품 소유자가 아닐 때 ForbiddenError를 반환해야 한다', async () => {
      jest.mocked(productsRepository.getProduct).mockResolvedValue({ ...mockProduct, userId: 2 });

      await expect(productsService.deleteProduct(1, 1)).rejects.toThrow(ForbiddenError);
    });
  });
});
