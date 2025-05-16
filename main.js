// main.js

// ProductService.js와 ArticleService.js에서 export한 함수들을 가져옵니다.
// 실제 사용하는 함수들만 선택적으로 import 할 수 있습니다.
import * as ProductAPI from './ProductService.js';
import * as ArticleAPI from './ArticleService.js';

// { 1 }
// Product 선언함
class Product {
  // constructor 객체를 생성할 때 실행되는 함수로, Product의 기능을 추가함
  // tags = []은 값이 없을 경우에 빈 배열로 둔다
  // favoriteCount(찜하기 수는 아직 없기 때문에 0으로 둔다
  constructor(name, description, price, tags = [], images = []) { // cosntuctor -> constructor 오타 수정
    this.name = name; // 상품명
    this.description = description;  //상품 설명
    this.price = price;  // 판매 가격
    this.tags = tags;   //해시태그 배열
    this.images = images;  //이미지 배열
    this.favoriteCount = 0;  //찜하기수(초기값 0)
  }

  // favorite 찜하기 기능을 수행하는 역할을 함
  // this.favoriteCount++; = 찜하기 수를 1씩 증가 시킨다
  // console.log() 는 찜하기 버튼을 눌렀을 때 "찜 했습니다, 현재 찜 횟수: X"라는 메시지가 출력된다.
  favorite() { // FAVORITE -> favorite (일반적으로 메소드명은 소문자로 시작)
    this.favoriteCount++;
    console.log(`❤️ ${this.name}을 찜했습니다! 현재 찜한 수: ${this.favoriteCount}`);
  }
}

// ElectronicProduct 클래스 선언함
// product 클래스를 상속 하여 기존 제품 정보를 유지함
// super(...)는 부모 클래스(Product)의 생성자를 호출하여 속성을 상속받는 역할을 함
class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images);
    // this.manufacturer = manufacturer; // 이 줄은 constructor 내부에 있어야 합니다.
    this.manufacturer = manufacturer; // 기본 제품(product)에 제조사(manufacturer)가 추가 됨
  }
}

// { 2 }
// 게시글을 나타내는 Article 클래스
class Article {
  // 캡슐화: likeCount를 private 필드로 선언 (#)
  #likeCount = 0;

  // 생성자: 제목, 내용, 작성자 초기화
  constructor(title, content, writer) {
    this.title = title;
    this.content = content;
    this.writer = writer;
  }

  // 좋아요 증가 메서드
  like() {
    this.#likeCount++;
    console.log(`"${this.title}" 게시글에 좋아요를 눌렀습니다! 현재 좋아요 수: ${this.#likeCount}`);
  }

  // 좋아요 개수를 가져오는 메서드 (캡슐화된 필드 접근)
  getLikeCount() {
    return this.#likeCount;
  }

  // 게시글 정보를 출력하는 메서드
  display() {
    console.log(`제목: ${this.title}`);
    console.log(`내용: ${this.content}`);
    console.log(`작성자: ${this.writer}`);
    console.log(`좋아요 수: ${this.#likeCount}`); // 직접 접근 대신 getLikeCount() 사용 권장 또는 이대로 유지
  }
}

// 공지사항 게시글 클래스 (Article을 상속)
class NoticeArticle extends Article {
  // 생성자: 중요도 추가
  constructor(title, content, writer, importance) {
    super(title, content, writer); // 부모 클래스의 생성자 호출
    this.importance = importance;
  }

  // 공지사항 게시글 출력 (부모 클래스의 display() 확장 - 오버라이딩)
  display() {
    super.display(); // 부모 클래스의 display() 호출하여 기본 정보 출력
    console.log(`중요도: ${this.importance}`);
  }
}

// --- 이하 예시 코드 ---
// main.js에서 위 클래스들과 서비스 함수들을 사용하는 방법 예시입니다.

// 예시 1: Product 클래스 사용
const newProduct = new Product("멋진 신발", "아주 편하고 예쁜 신발입니다.", 50000, ["신발", "패션"], ["image1.jpg"]);
newProduct.favorite();
console.log(newProduct);

const newElectronicProduct = new ElectronicProduct("최신형 노트북", "고사양 노트북입니다.", 1500000, ["노트북", "전자제품"], ["laptop.jpg"], "AwesomeElec");
console.log(newElectronicProduct);
newElectronicProduct.favorite();


// 예시 2: Article 클래스 사용
const myArticle = new Article("오늘의 일기", "오늘은 코딩 공부를 열심히 했다.", "코딩꿈나무");
myArticle.like();
myArticle.like();
myArticle.display();

const importantNotice = new NoticeArticle("서버 점검 안내", "오늘 밤 12시에 서버 점검이 있습니다.", "관리자", "매우 높음");
importantNotice.like();
importantNotice.display();


// 예시 3: ProductService.js 함수 사용 (비동기 함수이므로 async/await 또는 .then() 사용)
async function testProductAPI() {
  console.log("--- Product API 테스트 시작 ---");

  // 상품 목록 가져오기
  const products = await ProductAPI.getProductList(1, 5); // 1페이지, 페이지당 5개
  if (products) {
    console.log("첫 5개 상품:", products.data); // API 응답 구조에 따라 .data를 붙여야 할 수 있습니다.
  }

  // 새 상품 추가
  const createdProduct = await ProductAPI.createProduct({
    name: "테스트 상품",
    description: "API로 추가된 상품입니다.",
    price: 1000,
    tags: ["test"],
    images: []
  });
  if (createdProduct) {
    console.log("추가된 상품:", createdProduct);
    const productId = createdProduct.id; // 실제 API 응답에서 ID를 가져오는 방식에 따라 달라짐

    if (productId) {
      // 특정 상품 가져오기
      await ProductAPI.getProduct(productId);

      // 상품 수정
      await ProductAPI.patchProduct(productId, { price: 1200, description: "가격 수정됨" });
      await ProductAPI.getProduct(productId); // 수정 확인

      // 상품 삭제
      // await ProductAPI.deleteProduct(productId);
      // console.log(`${productId} 상품 삭제 시도 완료`);
    }
  }
  console.log("--- Product API 테스트 종료 ---");
}

// 예시 4: ArticleService.js 함수 사용
async function testArticleAPI() {
  console.log("--- Article API 테스트 시작 ---");

  // 게시글 목록 가져오기
  const articles = await ArticleAPI.getArticleList();
  if (articles && articles.list) { // API 응답 구조에 따라 .list 또는 다른 키를 사용해야 할 수 있습니다.
     console.log("게시글 목록 일부:", articles.list.slice(0,3));
  }


  // 새 게시글 작성
  const newArticleData = await ArticleAPI.createArticle("API 테스트 글", "axios를 사용한 API 연동 테스트입니다.", "test.jpg");
  if (newArticleData && newArticleData.id) {
    const articleId = newArticleData.id;
    console.log("생성된 게시글:", newArticleData);

    // 특정 게시글 가져오기
    await ArticleAPI.getArticle(articleId);

    // 게시글 삭제 (주의: 실제 삭제되므로 테스트 시 유의)
    // await ArticleAPI.deleteArticle(articleId);
    // console.log(`${articleId} 게시글 삭제 시도 완료`);
  }
  console.log("--- Article API 테스트 종료 ---");
}

// 위 테스트 함수들을 실행하려면 아래 주석을 해제하세요.
// testProductAPI();
// testArticleAPI();

// 브라우저 환경에서 ES6 모듈을 사용하려면 HTML 파일에서 <script type="module" src="main.js"></script> 와 같이 로드해야 합니다.