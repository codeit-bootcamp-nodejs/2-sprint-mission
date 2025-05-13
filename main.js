import { getArticleList, getArticle, patchArticle } from "./ArticleService.js";
import { getProductList } from "./ProductService.js";

// Product 클래스 생성
class Product {
  constructor(name, description, price, tags, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = 0;
  }

  favorite() {
    this.favoriteCount += 1;
    console.log(
      `${this.name}의 찜하기 수가 ${this.favoriteCount}로 증가했습니다.`
    );
  }
}

class ElectronicProduct extends Product {
  //ElectronicProduct 클래스 생성
  constructor(name, description, price, tags, images, manufacturer) {
    if (!tags.includes("전자제품")) {
      tags = [...tags, "전자제품"];
    }
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }
}

class Article {
  //Article 클래스 생성
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date();
    // 매번 호출할 때마다 현재 시간 반환
  }
  like() {
    // 좋아요 메소드
    this.likeCount += 1;
    console.log(
      `${this.title}의 좋아요 수가 ${this.likeCount}로 증가했습니다.`
    );
  }
}

//상품 목록 조회
const products = []; // 상품 목록을 저장할 배열

async function loadProducts() {
  const response = await getProductList(); // 상품 데이터 가져오기
  //products.push(...data); // 상품 목록을 배열에 추가
  const list = response?.list || []; // 상품 목록을 가져옴

  list.forEach((item) => {
    const { name, description, price, tags, images } = item; // 상품 정보 추출

    if (tags.includes("전자제품")) {
      // 태그에 '전자제품'이 포함된 경우만 필터링
      const electronic = new ElectronicProduct(
        name,
        description,
        price,
        tags,
        images,
        item.manufacturer
      ); // 전자제품 객체 생성
      products.push(electronic); // 상품 목록에 추가
    } else {
      //나머지는 Product 인스턴스
      const product = new Product(name, description, price, tags, images); // 일반 상품 객체 생성
      products.push(product); // 상품 목록에 추가
    }
  });
  console.log("상품 목록:", products); // 상품 목록 출력
}
loadProducts();



