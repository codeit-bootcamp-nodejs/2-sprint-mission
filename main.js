// main.js
import {
  getProductList,
 
} from './ProductService.js';
import {
  getArticleList,
 
} from './ArticleService.js';

class Product {
  #name; #description; #price; #tags; #images; #favoriteCount;
  constructor(name, description, price, tags = [], images = []) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = 0;
  }
  favorite() { this.#favoriteCount += 1; }
  get info() {
    return {
      name: this.#name,
      description: this.#description,
      price: this.#price,
      tags: this.#tags,
      images: this.#images,
      favoriteCount: this.#favoriteCount
    };
  }
}

class ElectronicProduct extends Product {
  #manufacturer;
  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images);
    this.#manufacturer = manufacturer;
  }
  get manufacturer() { return this.#manufacturer; }
}

class Article {
  #title; #content; #writer; #likeCount; #createdAt;
  constructor(title, content, writer) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = 0;
    this.#createdAt = new Date();
  }
  like() { this.#likeCount += 1; }
  get info() {
    return {
      title: this.#title,
      content: this.#content,
      writer: this.#writer,
      likeCount: this.#likeCount,
      createdAt: this.#createdAt
    };
  }
}

(async () => {
 
  try {
    const { list: rawProducts } = await getProductList(1, 10, '');
    const products = rawProducts.map(item => {
      const { name, description, price, tags, images, manufacturer } = item;
      if (tags.includes('전자제품')) {
        return new ElectronicProduct(name, description, price, tags, images, manufacturer);
      }
      return new Product(name, description, price, tags, images);
    });
    console.log('Products:', products.map(p => p.info));
  } catch (e) {
    console.error('Product API error:', e);
  }

  
  try {
    const articleResponse = await getArticleList(1, 10, '');
    console.log('Articles:', articleResponse.list);
  } catch (err) {
    console.error('Article API error:', err);
  }

  
  const p = new Product('테스트상품', '설명', 1000, ['#tag'], ['img.jpg']);
  p.favorite();
  console.log('Product.info:', p.info);

  const e = new ElectronicProduct(
    '전자제품', '상세내용', 2000, ['전자제품'], ['e.jpg'], '삼성'
  );
  console.log('ElectronicProduct.info:', e.info, 'manufacturer:', e.manufacturer);

  const a = new Article('제목', '내용', '작성자');
  a.like();
  console.log('Article.info:', a.info);
})();
