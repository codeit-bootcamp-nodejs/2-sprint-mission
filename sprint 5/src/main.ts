import { ElectronicProduct } from './models/ElectronicProduct';
import { Product } from './models/Product';
import * as ProductService from './services/ProductService';
import * as ArticleService from './services/ArticleService';
import type { Product as ProductType } from './services/ProductService';
import type { Article } from './services/ArticleService';

// Product 객체 배열 타입 명시
async function getProductListAndInstantiate(): Promise<void> {
  const rawProducts = await ProductService.getProductList(1, 20, '');

  const products: (Product | ElectronicProduct)[] = [];
  for (const rawProduct of rawProducts) {
    if (rawProduct.tags.includes('전자제품')) {
      products.push(
        new ElectronicProduct(
          rawProduct.name,
          rawProduct.description,
          rawProduct.price,
          rawProduct.tags,
          rawProduct.images,
          rawProduct.favoriteCount ?? 0,
          rawProduct.manufacturer ?? ''
        )
      );
    } else {
      products.push(
        new Product(
          rawProduct.name,
          rawProduct.description,
          rawProduct.price,
          rawProduct.tags,
          rawProduct.images,
          rawProduct.favoriteCount ?? 0
        )
      );
    }
  }

  console.log(products);
}

async function testProductService(): Promise<void> {
  const getProductListResponse = await ProductService.getProductList(1, 20, '');
  if (getProductListResponse.length === 0) {
    console.log('No products found');
    return;
  }
  const getProductResponse = await ProductService.getProduct(getProductListResponse[0].id);

  const createProductResponse = await ProductService.createProduct(
    '포토카드',
    '액자 포함',
    10000,
    undefined,
    ['소품'],
    ['https://picsum.photos/200/300']
  );
  const patchProductResponse = await ProductService.patchProduct(
    createProductResponse.id,
    createProductResponse.name,
    '액자 미포함',
    10000,
    createProductResponse.tags,
    createProductResponse.images
  );
  await ProductService.deleteProduct(createProductResponse.id);

  console.log(getProductListResponse);
  console.log(getProductResponse);
  console.log(createProductResponse);
  console.log(patchProductResponse);
  // 삭제 함수는 반환값이 없으므로 별도 출력 X
}

async function testArticleService(): Promise<void> {
  const getArticleListResponse = await ArticleService.getArticleList(1, 20, '');
  if (getArticleListResponse.length === 0) {
    console.log('No articles found');
    return;
  }
  const getArticleResponse = await ArticleService.getArticle(getArticleListResponse[0].id);

  const createArticleResponse = await ArticleService.createArticle(
    '안녕하세요',
    '내용입니다',
    'https://picsum.photos/200'
  );
  const patchArticleResponse = await ArticleService.patchArticle(
    createArticleResponse.id,
    createArticleResponse.title,
    '앞으로 잘 부탁드립니다.',
    createArticleResponse.image
  );
  await ArticleService.deleteArticle(createArticleResponse.id);

  console.log(getArticleListResponse);
  console.log(getArticleResponse);
  console.log(createArticleResponse);
  console.log(patchArticleResponse);
  // 삭제 함수는 반환값이 없으므로 별도 출력 X
}

async function main(): Promise<void> {
  await getProductListAndInstantiate();
  await testProductService();
  await testArticleService();
}

main();
