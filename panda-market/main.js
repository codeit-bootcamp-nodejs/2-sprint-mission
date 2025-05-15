import {
  getProductList
} from './ProductService.js';

import {
  getArticleList,
  createArticle
} from './ArticleService.js';

class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite() {
    this.favoriteCount += 1;
  }
}

class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer, favoriteCount = 0) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

class Article {
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date().toISOString();
  }

  like() {
    this.likeCount += 1;
  }
}

// 상품 리스트 인스턴스화
const products = [];

async function loadProducts() {
  const data = await getProductList();
  if (!data || !data.items) return;

  data.items.forEach(item => {
    const {
      name,
      description,
      price,
      tags,
      images,
      favoriteCount,
      manufacturer
    } = item;

    if (tags.includes('전자제품')) {
      products.push(new ElectronicProduct(name, description, price, tags, images, manufacturer, favoriteCount));
    } else {
      products.push(new Product(name, description, price, tags, images, favoriteCount));
    }
  });

  console.log(products);
}

// 테스트 실행
await loadProducts();

getArticleList().then(data => {
  console.log('Articles:', data);
});

const newArticle = new Article('테스트 제목', '이건 테스트입니다', '홍길동');
createArticle({
  title: newArticle.title,
  content: newArticle.content,
  image: 'https://example.com/image.png'
});
