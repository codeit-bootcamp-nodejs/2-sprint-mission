//####외부 모듈 import
import { getProductList } from './ProductService.js'; // _상품 목록 조회 함수_
import { Product } from './Product.js';               // _기본 상품 클래스_
import { ElectronicProduct } from './ElectronicProduct.js'; // _전자제품 클래스_
import { getArticleList } from './ArticleService.js'; // _기사 목록 조회 함수_
import { Article } from './Article.js';               // _기사 클래스_

//####제품 초기화 함수: 서버에서 제품 데이터를 받아와 클래스 인스턴스로 변환
async function initializeProducts() {
  try {
    const data = await getProductList(); //####API로부터 데이터 요청

    //####데이터 유효성 검사
    if (!data || !data.items) {
      console.error("제품 데이터를 불러오지 못했습니다.");
      return;
    }

    //####데이터 → 클래스 인스턴스로 변환
    const products = data.items.map(item => {
      //####태그에 '전자제품'이 포함되면 전자제품 클래스 사용
      if (item.tags.includes('전자제품')) {
        return new ElectronicProduct(
          item.name, item.description, item.price, item.tags, item.images, item.manufacturer
        );
      } else {
        return new Product(
          item.name, item.description, item.price, item.tags, item.images
        );
      }
    });

    console.log(products); //####결과 확인
  } catch (error) {
    console.error("제품 초기화 중 오류 발생:", error); //####예외 처리
  }
}

//####기사 초기화 함수: 서버에서 기사 데이터를 받아와 클래스 인스턴스로 변환
function initializeArticles() {
  getArticleList().then(data => {
    //####데이터 유효성 검사
    if (!data || !data.items) {
      console.error("기사 데이터를 불러오지 못했습니다.");
      return;
    }

    //####기사 데이터를 Article 인스턴스로 매핑
    const articles = data.items.map(item =>
      new Article(item.title, item.content, item.writer, item.likeCount)
    );

    console.log(articles); //####결과 확인
  }).catch(error => {
    console.error("기사 초기화 중 오류 발생:", error); //####예외 처리
  });
}

//####초기화 실행
initializeProducts();
initializeArticles();