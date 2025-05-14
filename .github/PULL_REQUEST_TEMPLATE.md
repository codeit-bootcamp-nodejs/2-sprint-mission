## 요구사항

### 기본
- [x]  class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
    -  Product 클래스는 `name`(상품명) `description`(상품 설명), `price`(판매 가격), `tags`(해시태그 배열), `images`(이미지 배열), `favoriteCount`(찜하기 수)프로퍼티를 가집니다.
    -  Product 클래스는 `favorite` 메소드를 가집니다. `favorite` 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
    - ElectronicProduct 클래스는 Product를 상속하며, 추가로 `manufacturer`(제조사) 프로퍼티를 가집니다.

- [x] class 키워드를 이용해서 Article 클래스를 만들어 주세요.
    - Article 클래스는 `title`(제목), `content`(내용), `writer`(작성자), `likeCount`(좋아요 수) 프로퍼티를 가집니다.
    - Article 클래스는 `like` 메소드를 가집니다. `like` 메소드가 호출될 경우 좋아요 수가 1 증가합니다.

- [x] 각 클래스 마다 **constructor**를 작성해 주세요.

- [x] 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.

- [x]  'https://panda-market-api-crud.vercel.app/docs' 의 Article API를 이용하여 아래 함수들을 구현해 주세요.
    - `getArticleList()` : GET 메소드를 사용해 주세요.
        - `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용해 주세요.
    - `getArticle()` : GET 메소드를 사용해 주세요.
    - `createArticle()` : POST 메소드를 사용해 주세요.
        - request body에 `title`, `content`, `image` 를 포함해 주세요.
    - `patchArticle()` : PATCH 메소드를 사용해 주세요.
    - `deleteArticle()` : DELETE 메소드를 사용해 주세요.

- [x] `fetch` 혹은 `axios`를 이용해 주세요.
    - 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.

- [x] `.then()` 메소드를 이용하여 비동기 처리를 해주세요.

- [x] `.catch()` 를 이용하여 오류 처리를 해주세요.

- [x]  'https://panda-market-api-crud.vercel.app/docs' 의 Product API를 이용하여 아래 함수들을 구현해 주세요.
    - `getProductList()` : GET 메소드를 사용해 주세요.
        - `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용해 주세요.
    - `getProduct()` : GET 메소드를 사용해 주세요.
    - `createProduct()` : POST 메소드를 사용해 주세요.
    - request body에 `name`, `description`, `price`, `tags`, `images` 를 포함해 주세요.
    - `patchProduct()` : PATCH 메소드를 사용해 주세요.
    - `deleteProduct()` : DELETE 메소드를 사용해 주세요.

- [x] `async/await` 을 이용하여 비동기 처리를 해주세요.

- [x] `try/catch` 를 이용하여 오류 처리를 해주세요.

- [x] `getProductList()`를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 `products` 배열에 저장해 주세요.
    - 해시태그에 "**전자제품**"이 포함되어 있는 상품들은 `Product` 클래스 대신 `ElectronicProduct` 클래스를 사용해 인스턴스를 생성해 주세요.
    - 나머지 상품들은 모두 `Product` 클래스를 사용해 인스턴스를 생성해 주세요.

- [x]  구현한 함수들을 아래와 같이 파일을 분리해 주세요.
    - **export**를 활용해 주세요.
    - `ProductService.js` 파일 **Product** API 관련 함수들을 작성해 주세요.
    - `ArticleService.js` 파일에 **Article** API 관련 함수들을 작성해 주세요.
    
- [x]  이외의 코드들은 모두 `main.js` 파일에 작성해 주세요.
    - **import**를 활용해 주세요.
    - 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.

### 심화
- [x]  Article 클래스에 `createdAt`(생성일자) 프로퍼티를 만들어 주세요.
    - 새로운 객체가 생성되어 constructor가 호출될 시 `createdAt`에 현재 시간을 저장합니다.

## 주요 변경사항
- 처음으로 GitHub에서 fork → clone → commit → push → PR의 흐름을 따라가며 과제를 제출해보았습니다. 

## 멘토에게
- 기능이 되도록 작성하려고 했지만 실행이 안되는 중입니다.
- 아직 제가 무엇을 모르는지 모르는 상태 입니다. 부족한 점이 있다면 알려주시면 감사하겠습니다
