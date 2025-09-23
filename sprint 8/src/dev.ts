import { ElectronicProduct } from './models/ElectronicProduct';
import { Product } from './models/Product';
import * as ProductService from './services/ProductService';
import * as ArticleService from './services/ArticleService';
import { PrismaClient, NotificationType } from '@prisma/client';
import NotificationRepository from './notification/repository';
import NotificationService from './notification/service';

const prisma = new PrismaClient();
const notifRepo = new NotificationRepository(prisma);
const notifSvc = new NotificationService(notifRepo);

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

async function testProductService(): Promise<number | null> {
  const getProductListResponse = await ProductService.getProductList(1, 20, '');
  if (getProductListResponse.length === 0) {
    console.log('No products found');
    return null;
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

  return getProductResponse?.id ?? null;
}

async function testArticleService(): Promise<number | null> {
  const getArticleListResponse = await ArticleService.getArticleList(1, 20, '');
  if (getArticleListResponse.length === 0) {
    console.log('No articles found');
    return null;
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

  return getArticleResponse?.id ?? null;
}

async function main(): Promise<void> {
  try {
    await getProductListAndInstantiate();
    const productId = await testProductService();
    const articleId = await testArticleService();

    // 🔔 알림 테스트 생성 (userId=1 데모)
    if (productId) {
      await notifSvc.create({
        userId: 1,
        type: NotificationType.PRICE_CHANGED,
        productId,
        message: `관심 상품(#${productId}) 가격 변경 알림 (테스트)`,
      });
    }
    if (articleId) {
      await notifSvc.create({
        userId: 1,
        type: NotificationType.COMMENT_ADDED,
        articleId,
        message: `게시글(#${articleId})에 새 댓글 알림 (테스트)`,
      });
    }

    const notifications = await notifSvc.list(1, { take: 10 });
    console.log(
      '🔔 Notifications (user:1):',
      notifications.map((n) => ({ id: n.id, type: n.type, msg: n.message, isRead: n.isRead }))
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 실행 가드(다른 곳에서 import 시 자동 실행 방지)
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}
