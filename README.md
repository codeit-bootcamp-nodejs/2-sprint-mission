## 요구사항

### 기본 
[x] class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
 * Product 클래스는 name, description, price, tags, images, favoriteCount 프로퍼티를 가집니다.
 * Product 클래스는 favorite() 메서드를 통해 찜하기 수를 1 증가시킵니다.
 * ElectronicProduct 클래스는 Product 클래스를 상속받아 manufacturer 프로퍼티를 추가로 가집니다.

[x] class 키워드를 이용해서 Article 클래스를 만들어 주세요.
 * Article 클래스는 title, content, writer, likeCount 프로퍼티를 가집니다.
 * Article 클래스는 like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.

[x] 각 클래스 마다 constructor를 작성해 주세요.

[x] 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.
 * 추상화: Product, ElectronicProduct, Article 클래스를 통해 분류를 하도록 하고 API 함수를 통해 정보를 주고 받을 수 있도록 함
 * 캡슐화: Product 클래스의 price 속성에 getter와 setter를 사용하여 가격 변경 시 유효성 검사를 수행하도록 하고, Article 클래스를 통해 외부에서는 쉽게 날짜를 수정 할 수 없도록 #createdAt 생성
 * 상속: ElectronicProduct 클래스는 Product 클래스를 상속받아 공통 속성과 메서드를 재사용하고, 특정 속성(manufacturer)을 추가함
 * 다형성: ElectronicProduct 클래스는 favorite() 메서드를 Product와 다른 동작(찜하기 수 2 증가)을 수행하도록 함

[x] getArticleList() : GET 메소드를 사용해 주세요 
 * page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.

[x] getArticle() : GET 메소드를 사용해 주세요. (fetch, .then/.catch 사용)

[x] createArticle() : POST 메소드를 사용해 주세요.
 * request body에 title, content, image 를 포함해 주세요.

[x]patchArticle() : PATCH 메소드를 사용해 주세요. (fetch, .then/.catch 사용)

[x]deleteArticle() : DELETE 메소드를 사용해 주세요. (fetch, .then/.catch 사용)
 (응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.)

[x] Product API 관련 함수 구현 (ProductService.js)

[x] getProductList() : GET 메소드를 사용해 주세요.
 * page, pageSize, keyword 쿼리 파라미터 처리 (async/await, try/catch 사용)

[x] getProduct() : GET 메소드를 사용해 주세요. (async/await, try/catch 사용)

[x] createProduct() : POST 메소드를 사용해 주세요.
 * name, description, price, tags, images를 request body에 포함 (async/await, try/catch 사용)


[x] patchProduct() : PATCH 메소드를 사용해 주세요. (async/await, try/catch 사용)

[x] deleteProduct() : DELETE 메소드를 사용해 주세요. (async/await, try/catch 사용)
 * 응답 상태 코드 2XX가 아닐 경우 에러 메시지 콘솔 출력 및 catch 블록에서 오류 처리

[x] getProductList()를 통해 받아온 상품 데이터를 순회하며 각 상품에 대해 Product 또는 ElectronicProduct 클래스의 인스턴스를 생성합니다.
 * 해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
 * 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.

[x] 구현한 함수들을 아래와 같이 파일을 분리해 주세요.
 * export를 활용해 주세요.
 * ProductService.js 파일 Product API 관련 함수들을 작성해 주세요.
 * ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.

[x] 이외의 코드들은 모두 main.js 파일에 작성해 주세요.
 * import 활용 (main.js)
 * 각 함수 실행 및 동작 확인 (main.js)


### 심화 
[x] Article 클래스에 createdAt(생성일자) 프로퍼티를 만들어 주세요. (캡슐화 추가)
 * 새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장하고, 외부에서의 직접적인 수정을 방지하기 위해 캡슐화 기능 추가

 ## 주요 변경사항
 - 신규 등록

 ## 스크린샷

 ## 멘토에게