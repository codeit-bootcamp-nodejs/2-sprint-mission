## 과제 요구사항 체크리스트
- [ ] class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
- [ ] Product 클래스는 name(상품명), description(상품 설명), price(판매 가격), tags(해시태그 배열), images(이미지 배열), favoriteCount(찜하기 수) 프로퍼티를 가집니다.
- [ ] Product 클래스는 favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
- [ ] ElectronicProduct 클래스는 Product를 상속하며, 추가로 manufacturer(제조사) 프로퍼티를 가집니다.
- [ ] class 키워드를 이용해서 Article 클래스를 만들어 주세요.
- [ ] Article 클래스는 title(제목), content(내용), writer(작성자), likeCount(좋아요 수) 프로퍼티를 가집니다.
- [ ] Article 클래스는 like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
- [ ] 각 클래스마다 constructor를 작성해 주세요.
- [ ] 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.

### Article API 구현 (`https://panda-market-api-crud.vercel.app/docs`)
- [ ] getArticleList() : GET 메소드를 사용해 주세요. (page, pageSize, keyword 쿼리 파라미터)
- [ ] getArticle() : GET 메소드를 사용해 주세요.
- [ ] createArticle() : POST 메소드를 사용해 주세요. (body에 title, content, image)
- [ ] patchArticle() : PATCH 메소드를 사용해 주세요.
- [ ] deleteArticle() : DELETE 메소드를 사용해 주세요.
- [ ] fetch 혹은 axios를 이용해 주세요.
- [ ] 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
- [ ] .then() 메소드를 이용하여 비동기 처리를 해주세요.
- [ ] .catch()를 이용하여 오류 처리를 해주세요.

### Product API 구현 (`https://panda-market-api-crud.vercel.app/docs`)
- [ ] getProductList() : GET 메소드를 사용해 주세요. (page, pageSize, keyword 쿼리 파라미터)
- [ ] getProduct() : GET 메소드를 사용해 주세요.
- [ ] createProduct() : POST 메소드를 사용해 주세요. (body에 name, description, price, tags, images)
- [ ] patchProduct() : PATCH 메소드를 사용해 주세요.
- [ ] deleteProduct() : DELETE 메소드를 사용해 주세요.
- [ ] async/await을 이용하여 비동기 처리를 해주세요.
- [ ] try/catch를 이용하여 오류 처리를 해주세요.
- [ ] getProductList()를 통해 받아온 상품 리스트를 인스턴스로 만들어 products 배열에 저장해 주세요.
- [ ] 해시태그에 "전자제품"이 포함된 상품은 ElectronicProduct 클래스로 생성해 주세요.
- [ ] 나머지 상품은 Product 클래스로 생성해 주세요.

### 파일 분리 및 모듈화
- [ ] export를 활용해 주세요.
- [ ] ProductService.js 파일에 Product API 관련 함수들을 작성해 주세요.
- [ ] ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.
- [ ] 이외의 코드는 모두 main.js 파일에 작성해 주세요.
- [ ] import를 활용해 주세요.
- [ ] 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.


### 심화 요구사항
- `Article` 클래스에 `createdAt`(생성일자) 프로퍼티를 만들어 주세요.
- 새로운 객체가 생성되어 `constructor`가 호출될 시 `createdAt`에 현재 시간을 저장합니다.

---


## 주요 변경사항


## 멘토님께
 

