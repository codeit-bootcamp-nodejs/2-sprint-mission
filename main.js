import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.js';

// Product 클래스 (4단계에서 사용)
class Product {
  constructor(id, name, description, price, tags, images) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
  }

  displayInfo() {
    console.log(`ID: ${this.id}, Name: ${this.name}, Price: ${this.price}, Tags: ${this.tags}`);
  }
}

// ElectronicProduct 클래스 (4단계에서 사용, Product 상속)
class ElectronicProduct extends Product {
  constructor(id, name, description, price, tags, images, manufacturer) {
    super(id, name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }

  displayInfo() {
    super.displayInfo();
    console.log(`Manufacturer: ${this.manufacturer}`);
  }
}

async function main() {
  const products = [];

  try {
    const productListData = await getProductList();
    if (productListData && Array.isArray(productListData)) {
      productListData.forEach((product) => {
        if (product.tags && product.tags.includes('전자제품')) {
          products.push(new ElectronicProduct(
            product.id,
            product.name,
            product.description,
            product.price,
            product.tags,
            product.images,
            product.manufacturer || '알 수 없음' // 제조사 정보가 없을 경우 기본값 설정
          ));
        } else {
          products.push(new Product(
            product.id,
            product.name,
            product.description,
            product.price,
            product.tags,
            product.images
          ));
        }
      });
    } else {
      console.error('Failed to fetch or invalid product list data.');
    }
  } catch (error) {
    console.error('Error processing product list:', error);
  }

  console.log('생성된 상품 인스턴스:', products);
  products.forEach(product => product.displayInfo());

  // 5단계: 함수 실행 및 동작 확인 (Article API)
  console.log('\n--- Article API 호출 ---');
  try {
    const articleList = await getArticleList(1, 5, '제목');
    console.log('Article List:', articleList);

    const singleArticle = await getArticle('someArticleId'); // 실제 ID로 변경 필요
    console.log('Single Article:', singleArticle);

    const newArticle = await createArticle('새로운 제목', '새로운 내용', '이미지 URL');
    console.log('Created Article:', newArticle);

    const updatedArticle = await patchArticle('someArticleId', { content: '수정된 내용' }); // 실제 ID로 변경 필요
    console.log('Patched Article:', updatedArticle);

    const deleteResult = await deleteArticle('someArticleId'); // 실제 ID로 변경 필요
    console.log('Delete Result:', deleteResult);
  } catch (error) {
    console.error('Error during Article API calls:', error);
  }

  // 5단계: 함수 실행 및 동작 확인 (Product API)
  console.log('\n--- Product API 호출 ---');
  try {
    const productList = await getProductList(1, 5, '상품'); // 이미 위에서 호출했지만 다시 호출하여 확인
    console.log('Product List:', productList);

    const singleProduct = await getProduct('someProductId'); // 실제 ID로 변경 필요
    console.log('Single Product:', singleProduct);

    const newProduct = await createProduct('새로운 상품', '새로운 설명', 99.99, ['새 태그'], ['새 이미지 URL']);
    console.log('Created Product:', newProduct);

    const updatedProduct = await patchProduct('someProductId', { price: 129.99 }); // 실제 ID로 변경 필요
    console.log('Patched Product:', updatedProduct);

    const deleteProductResult = await deleteProduct('someProductId'); // 실제 ID로 변경 필요
    console.log('Delete Product Result:', deleteProductResult);
  } catch (error) {
    console.error('Error during Product API calls:', error);
  }
}