# 권은혜의 Sprint 1 & 2

# JavaScript 코드 모듈화 예제: 상품 및 게시글 관리

## 📝 프로젝트 개요

본 프로젝트는 JavaScript의 주요 개념(클래스, 상속, 캡슐화)과 비동기 API 통신을 활용하여 간단한 상품 관리 및 게시글 관리 기능을 구현한 예제입니다. 코드를 기능별로 모듈화하여 가독성과 유지보수성을 높이는 것을 목표로 합니다.

주요 기능은 다음과 같습니다:
* **상품(Product) 관리**: 상품 정보 클래스 정의, 찜하기 기능, 전자제품(ElectronicProduct) 하위 클래스를 통한 확장.
* **게시글(Article) 관리**: 게시글 정보 클래스 정의, 좋아요 기능, 공지사항(NoticeArticle) 하위 클래스를 통한 확장, 좋아요 수 캡슐화.
* **API 연동**: 외부 API를 사용하여 상품 및 게시글 데이터를 조회, 생성, 수정, 삭제하는 기능 구현.

## 📂 파일 구조

프로젝트는 다음과 같은 주요 JavaScript 파일로 구성되어 있습니다:

* `main.js`: 핵심 클래스(Product, Article 등) 정의 및 서비스 모듈을 활용한 예시 실행 로직 포함.
* `ProductService.js`: 상품 관련 API 요청을 처리하는 함수들의 모음. (`Workspace` API 사용)
* `ArticleService.js`: 게시글 관련 API 요청을 처리하는 함수들의 모음. (`axios` 라이브러리 사용)
* `README.md`: 현재 보고 계신 프로젝트 설명 파일.

## ✨ 주요 기술 스택

* **JavaScript (ES6+)**: 클래스, 화살표 함수, `async/await`, 모듈(`import`/`export`) 등 최신 문법 사용.
* **Fetch API**: `ProductService.js`에서 서버와의 비동기 HTTP 통신을 위해 사용.
* **Axios**: `ArticleService.js`에서 서버와의 비동기 HTTP 통신을 위해 사용된 Promise 기반 라이브러리.
* **Markdown**: 본 `README.md` 파일 작성에 사용.

## ⚙️ 코드 상세 설명

### 1. `main.js`

이 파일은 애플리케이션의 주요 로직과 클래스 정의를 포함합니다.

* **`Product` 클래스**:
    * `constructor(name, description, price, tags = [], images = [])`: 상품명, 설명, 가격, 태그, 이미지 배열을 속성으로 가집니다.
    * `favorite()`: 상품을 찜하고 찜한 횟수를 증가시키는 메소드입니다.

* **`ElectronicProduct` 클래스**:
    * `Product` 클래스를 상속받아 상품의 기본 기능에 `manufacturer`(제조사) 속성을 추가합니다.

* **`Article` 클래스**:
    * `constructor(title, content, writer)`: 제목, 내용, 작성자를 속성으로 가집니다.
    * `#likeCount`: 게시글의 좋아요 수를 저장하는 private 필드 (캡슐화).
    * `like()`: 좋아요 수를 1 증가시키는 메소드.
    * `getLikeCount()`: 현재 좋아요 수를 반환하는 메소드.
    * `display()`: 게시글 정보를 콘솔에 출력하는 메소드.

* **`NoticeArticle` 클래스**:
    * `Article` 클래스를 상속받아 게시글의 기본 기능에 `importance`(중요도) 속성을 추가합니다.
    * `display()`: 부모 클래스의 `display()` 메소드를 오버라이딩하여 중요도 정보까지 함께 출력합니다.

* **API 서비스 사용 예시**:
    * `ProductService.js`와 `ArticleService.js`에서 `export` 된 함수들을 `import` 하여 실제 API를 호출하고 응답을 처리하는 예시 코드가 포함될 수 있습니다 (예: `testProductAPI()`, `testArticleAPI()`).

    ```javascript
    // 예시: ProductService 사용
    import * as ProductAPI from './ProductService.js';

    async function demoProducts() {
      const products = await ProductAPI.getProductList();
      if (products) {
        console.log("상품 목록:", products.data);
      }
    }
    // demoProducts();
    ```

### 2. `ProductService.js`

상품(Product) 데이터와 관련된 모든 서버 통신(API 호출)을 담당합니다. `Workspace` API와 `async/await`를 사용하여 비동기 작업을 처리합니다.

* **`getProductList(page, pageSize, keyword)`**: 상품 목록을 서버에서 가져옵니다. (GET 요청)
* **`getProduct(productId)`**: 특정 ID의 상품 상세 정보를 가져옵니다. (GET 요청)
* **`createProduct(productData)`**: 새로운 상품 정보를 서버에 전송하여 생성합니다. (POST 요청)
* **`patchProduct(productId, updatedData)`**: 특정 ID의 상품 정보를 수정합니다. (PATCH 요청)
* **`deleteProduct(productId)`**: 특정 ID의 상품을 삭제합니다. (DELETE 요청)

각 함수는 `export` 키워드를 통해 외부 모듈(`main.js` 등)에서 사용할 수 있도록 제공됩니다.

```javascript
// ProductService.js 예시
export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const response = await fetch(`https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`);
    // ... (오류 처리 및 데이터 반환 로직) ...
  } catch (error) {
    console.error("상품 목록 가져오기 오류:", error);
    return null;
  }
}