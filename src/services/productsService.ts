import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import * as productsRepository from '../repositories/productsRepository';
import * as favoritesRepository from '../repositories/favoritesRepository';
import * as notificationsService from '../services/notificationsService';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import Product from '../types/Product';

type CreateProductData = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'favoriteCount' | 'isFavorited'
>;
type UpdateProductData = Partial<CreateProductData> & { userId: number };

export async function createProduct(data: CreateProductData): Promise<Product> {
  const createdProduct = await productsRepository.createProduct(data);
  return {
    ...createdProduct,
    favoriteCount: 0,
    isFavorited: false,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const product = await productsRepository.getProductWithFavorites(id);
  if (!product) {
    throw new NotFoundError('product', id);
  }
  return product;
}

export async function getProductList(
  params: PagePaginationParams,
  { userId }: { userId?: number } = {},
): Promise<PagePaginationResult<Product>> {
  const products = await productsRepository.getProductListWithFavorites(params, { userId });
  return products;
}

export async function updateProduct(id: number, data: UpdateProductData): Promise<Product> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== data.userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  // 가격 변경 감지
  const priceChanged = data.price && data.price !== existingProduct.price;

  const updatedProduct = await productsRepository.updateProductWithFavorites(id, data);

  // 가격이 변경되었으면 좋아요한 사용자들에게 알림 발송
  if (priceChanged) {
    const favorites = await favoritesRepository.getFavoritesByProductId(id);
    for (const favorite of favorites) {
      await notificationsService.createAndSendNotification({
        type: 'PRICE_CHANGE',
        message: `"${existingProduct.name}" 상품 가격이 ${existingProduct.price}원에서 ${data.price}원으로 변경되었습니다.`,
        userId: favorite.userId,
        relatedId: id,
      });
    }
  }

  return updatedProduct;
}

export async function deleteProduct(id: number, userId: number): Promise<void> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  await productsRepository.deleteProduct(id);
}
