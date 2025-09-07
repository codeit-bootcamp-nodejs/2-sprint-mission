import * as productsService from '../src/services/productsService';
import * as productsRepository from '../src/repositories/productsRepository';
import * as favoritesRepository from '../src/repositories/favoritesRepository';
import * as notificationsService from '../src/services/notificationsService';

import NotFoundError from '../src/lib/errors/NotFoundError';
import ForbiddenError from '../src/lib/errors/ForbiddenError';
import { NotificationType } from '../src/types/Notification';

jest.mock('../src/repositories/productsRepository');
jest.mock('../src/repositories/favoritesRepository');
jest.mock('../src/services/notificationsService');

const pRepo = productsRepository as jest.Mocked<typeof productsRepository>;
const fRepo = favoritesRepository as jest.Mocked<typeof favoritesRepository>;

describe('productService (unit)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ---------- createProduct ----------
    test('createProduct: DB에 생성하고 favoriteCount=0, isFavorited=false로 반환', async () => {
        const fake_value = {
            id: 1,
            userId: 100,
            title: 'A',
            price: 1000,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any
        pRepo.createProduct.mockResolvedValue(fake_value);

        const input = { userId: 100, title: 'A', price: 1000 } as any;
        const result = await productsService.createProduct(input);

        expect(pRepo.createProduct).toHaveBeenCalledTimes(1);
        expect(pRepo.createProduct).toHaveBeenCalledWith(input);
        expect(result.favoriteCount).toBe(0);
        expect(result.isFavorited).toBe(false);
    });

    // ---------- getProduct ----------
    test('getProduct: 존재하면 product 반환(getProductWithFavorites 사용)', async () => {
        const fake_value = {
            id: 1,
            userId: 100,
            title: 'A',
            price: 1000,
            favoriteCount: 2,
            isFavorited: false,
        } as any;
        pRepo.getProductWithFavorites.mockResolvedValue(fake_value);

        const result = await productsService.getProduct(1);
        expect(pRepo.getProductWithFavorites).toHaveBeenCalledWith(1);
        expect(result).toEqual(fake_value);
    });

    test('getProduct: 없으면 NotFoundError', async () => {
        pRepo.getProductWithFavorites.mockResolvedValue(null);

        await expect(productsService.getProduct(999)).rejects.toBeInstanceOf(NotFoundError);
    });

    // ---------- getProductList ----------
    test('getProductList: 파라미터를 repo에 그대로 위임', async () => {
        const params = { page: 2, pageSize: 10, keyword: 'abc', orderBy: 'recent' as const };
        const fake_value = {
            items: [{ id: 1, title: 'abc', price: 10 }],
            page: 2,
            pageSize: 10,
            total: 1,
        } as any;
        pRepo.getProductListWithFavorites.mockResolvedValue(fake_value);

        const result = await productsService.getProductList(params, { userId: 777 });

        expect(pRepo.getProductListWithFavorites).toHaveBeenCalledWith(params, { userId: 777 });
        expect(result).toEqual(fake_value);
    });

    // ---------- updateProduct ----------
    test('updateProduct: 없으면 NotFoundError', async () => {
        pRepo.getProduct.mockResolvedValue(null);

        await expect(
            productsService.updateProduct(1, { userId: 100, description: 'x' })
        ).rejects.toBeInstanceOf(NotFoundError);

        expect(pRepo.updateProductWithFavorites).not.toHaveBeenCalled();
    });

    test('updateProduct: 소유자 아님 -> ForbiddenError', async () => {
        const fake_value = { id: 1, userId: 200, price: 1000 } as any;
        pRepo.getProduct.mockResolvedValue(fake_value);

        await expect(
            productsService.updateProduct(1, { userId: 100, description: 'x' })
        ).rejects.toBeInstanceOf(ForbiddenError);

        expect(pRepo.updateProductWithFavorites).not.toHaveBeenCalled();
    });

    test('updateProduct: 가격 변경 없음 -> 알림 전송 안 함', async () => {
        const fake_value = { id: 1, userId: 100, price: 1000 } as any;
        pRepo.getProduct.mockResolvedValue(fake_value);
        pRepo.updateProductWithFavorites.mockResolvedValue({
            id: 1, userId: 100, price: 1000, description: 'changed'
        } as any);

        const result = await productsService.updateProduct(1, { userId: 100, description: 'changed' });

        expect(pRepo.updateProductWithFavorites).toHaveBeenCalledWith(1, { userId: 100, description: 'changed' });
        expect(fRepo.getFavoritesByProductId).not.toHaveBeenCalled();

        const spyFn = jest.spyOn(notificationsService, "createNotifications");
        expect(spyFn).not.toHaveBeenCalled();
        expect(result.description).toBe('changed');
    });

    test('updateProduct: 가격 변경됨 -> 즐겨찾기 유저들에게 알림 전송', async () => {
        pRepo.getProduct.mockResolvedValue({ id: 1, userId: 100, price: 1000 } as any);
        pRepo.updateProductWithFavorites.mockResolvedValue({
            id: 1, userId: 100, price: 1200, title: 'A'
        } as any);
        fRepo.getFavoritesByProductId.mockResolvedValue([
            { userId: 201 }, { userId: 202 }, { userId: 203 },
        ] as any);

        await productsService.updateProduct(1, { userId: 100, price: 1200 });

        expect(fRepo.getFavoritesByProductId).toHaveBeenCalledWith(1);

        const spyFn = jest.spyOn(notificationsService, "createNotifications");
        expect(spyFn).toHaveBeenCalledTimes(1);
        // payload 형태 검증
        expect(spyFn).toHaveBeenCalledWith([
            {
                userId: 201,
                type: NotificationType.PRICE_CHANGED,
                payload: { productId: 1, price: 1200 },
            },
            {
                userId: 202,
                type: NotificationType.PRICE_CHANGED,
                payload: { productId: 1, price: 1200 },
            },
            {
                userId: 203,
                type: NotificationType.PRICE_CHANGED,
                payload: { productId: 1, price: 1200 },
            },
        ]);
    });

    // ---------- deleteProduct ----------
    test('deleteProduct: 없으면 NotFoundError', async () => {
        pRepo.getProduct.mockResolvedValue(null);

        await expect(productsService.deleteProduct(1, 100)).rejects.toBeInstanceOf(NotFoundError);
        expect(pRepo.deleteProduct).not.toHaveBeenCalled();
    });

    test('deleteProduct: 소유자 아님 -> ForbiddenError', async () => {
        const fake_value = { id: 1, userId: 999 } as any;
        pRepo.getProduct.mockResolvedValue(fake_value);

        await expect(productsService.deleteProduct(1, 100)).rejects.toBeInstanceOf(ForbiddenError);
        expect(pRepo.deleteProduct).not.toHaveBeenCalled();
    });

    test('deleteProduct: 소유자면 삭제 호출', async () => {
        const fake_value = { id: 1, userId: 100 } as any;
        pRepo.getProduct.mockResolvedValue(fake_value);
        pRepo.deleteProduct.mockResolvedValue(undefined as any);

        await productsService.deleteProduct(1, 100);

        expect(pRepo.deleteProduct).toHaveBeenCalledTimes(1);
        expect(pRepo.deleteProduct).toHaveBeenCalledWith(1);
    });
});