import { getProductList } from "../ProductService.js";


class Product {
    constructor(name, description, price, tags, images, favoriteCount) {
        this.name = name
        this.description = description
        this.price = price
        this.tags = tags
        this.images = images
        this.favoriteCount = favoriteCount
    }
     favorite () {
        this.favoriteCount += 1
     }
}

class ElectronicProduct extends Product {
    constructor(name, description, price, tags, images, favoriteCount,manufacturer) {
        super(name, description, price, tags, images, favoriteCount)
        this.manufacturer = manufacturer
    }

}

class Article {
    constructor(title, content, writer, likeCount) {
        this.title = title
        this.content = content
        this.writer = writer
        this.likeCount = likeCount
        this.createdAt = new Date().toISOString()
    }
    like() {
        this.likeCount += 1
    }
}

const products = []

getProductList({ page: 1, pageSize: 20, keyword: '' })
  .then(data => {
    if (!data || data.length === 0) {
      console.error("API 호출에 실패");
      return;
    }

    data.forEach(item => {
      const { name, description, price, tags, images, favoriteCount, manufacturer } = item;

      if (tags.includes("전자제품")) {
        const electronic = new ElectronicProduct(name, description, price, tags, images, favoriteCount, manufacturer);
        products.push(electronic);
      } else {
        const product = new Product(name, description, price, tags, images, favoriteCount);
        products.push(product);
      }
    });
  })
  .catch(error => {
    console.error('API 호출 중 오류 발생:', error);
  });
