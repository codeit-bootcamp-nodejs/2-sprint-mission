## 요구사항
### 기본
#### 미션 1
- [x] class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.  

  [Product.mjs](/source/product/Product.mjs)  
  [ElectronicProduct.mjs](/source/product/ElectronicProduct.mjs)

  - [x] Product 클래스는 **name** (상품명), **description** (상품 설명), **price** (판매 가격), **tags** (해시태그 배열), **images** (이미지 배열), **favoriteCount** (찜하기 수) 프로퍼티를 가집니다.  

    [Product 클래스 프로퍼티](/source/product/Product.mjs#L4-L10)
  
  - [x] Product 클래스는 **favorite** 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.  

    [Product 클래스 favorite 메서드](/source/product/Product.mjs#L73-L75)

  - [x] ElectronicProduct 클래스는 Product를 상속하며, 추가로 **manufacturer** (제조사) 프로퍼티를 가집니다.  

    [ElectronicProduct 클래스 프로퍼티](/source/product/ElectronicProduct.mjs#L5)

- [x] class 키워드를 이용해서 Article 클래스를 만들어 주세요. 

  [Article.mjs](/source/article/Article.mjs)

  - [x] Article 클래스는 **title** (제목), **content** (내용), **writer** (작성자), **likeCount** (좋아요 수) 프로퍼티를 가집니다.  

    [Article 클래스 프로퍼티](/source/article/Article.mjs#L4-L10)

  - [x] Article 클래스는 **like** 메소드를 가집니다. **like** 메소드가 호출될 경우 좋아요 수가 1 증가합니다.  

    [Article 클래스 like 메소드](/source/article/Article.mjs#L56-L58)

- [x] 각 클래스 마다 **constructor** 를 작성해 주세요.
- [x] 추상화\/캡슐화\/상속\/다형성을 고려하여 코드를 작성해 주세요.

- [x] [api 문서](https://panda-market-api-crud.vercel.app/docs) 의 ArticleAPI를 이용하여 아래 함수들을 구현해 주세요.
  - [x] **getArticleList()** : GET 메소드를 사용해 주세요
    - [x] **page**, **pageSize**, **keyword** 쿼리 파라미터를 이용해 주세요.  

  [getArticleList 메서드](/source/ArticleService.js#L41-L56)

  - [x] **getArticle()** : GET 메소드를 사용해 주세요.

  [getArticle 메서드](/source/ArticleService.js#L27-L39)

  - [x] **createArticle()** : POST 메소드를 사용해 주세요.
    - [x] request body에 **title**, **content**, **image** 를 포함해 주세요.

  [createArticle 메서드](/source/ArticleService.js#L58-L72)

  - [x] **patchArticle()** : PATCH 메소드를 사용해 주세요.

  [patchArticle 메서드](/source/ArticleService.js#L74-L87)

  - [x] **deleteArticle()** : DELETE 메소드를 사용해 주세요.

  [deleteArticle 메서드](/source/ArticleService.js#L89-L97)

- [x] **fetch** 혹은 **axios** 를 이용해 주세요.
  - [x] 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
- [x] **.then()** 메소드를 이용하여 비동기 처리를 해주세요.
- [x] **.catch()** 를 이용하여 오류 처리를 해주세요.
- [x] [api 문서](https://panda-market-api-crud.vercel.app/docs) 의 ProductAPI를 이용하여 아래 함수들을 구현해 주세요.
  - [x] **getProductList()** : GET 메소드를 사용해 주세요.
    - [x] **page**, **pageSize**, **keyword** 쿼리 파라미터를 이용해 주세요.

  [getProductList 메서드](/source/ProductService.js#L37-L48)

  - [x] **getProduct()** : GET 메소드를 사용해 주세요.

  [getProduct 메서드](/source/ProductService.js#L27-36)

  - [x] **createProduct()** : POST 메소드를 사용해 주세요.
    - [x] request body에 **name**, **description**, **price**, **tags**, **images** 를 포함해 주세요.
  
  [createProduct 메서드](/source/ProductService.js#L50-60)

  - [x] **patchProduct()** : PATCH 메소드를 사용해 주세요.

  [patchProduct 메서드](/source/ProductService.js#L62-73)

  - [x] **deleteProduct()** : DELETE 메소드를 사용해 주세요.

  [deleteProduct 메서드](/source/ProductService.js#L75-83)

- [x] **async/await** 을 이용하여 비동기 처리를 해주세요.
- [x] **try/catch** 를 이용하여 오류 처리를 해주세요.
- [x] **getProductList()**를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
  - [x] 해시태그에 \"**전자제품**\"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
  - [x] 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.  

  **분류 메소드** [ProductCallbacks.mjs](/source/product/ProductCallbacks.mjs#L9-L19)  
  **사용 예시** [CreateProductResponse.mjs](/source/product/responses/CreateProductResponse.mjs#L7)

- [x] 구현한 함수들을 아래와 같이 파일을 분리해 주세요.
  - [x] **export** 를 활용해 주세요.
  - [x] **ProductService.js** 파일에 Product API 관련 함수들을 작성해 주세요.
  - [x] **ArticleService.js** 파일에 Article API 관련 함수들을 작성해 주세요.

  [ProductService.js](/source/ProductService.js)  
  [ArticleService.js](/source/ArticleService.js)

- [x] 이외의 코드들은 모두 main.js 파일에 작성해 주세요.
  - [x] **import** 를 활용해 주세요.
  - [x] 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.

  [main.js](/main.js)

#### 미션 2
- [x] [스프린트 미션 제출 방법](https://www.codeit.kr/topics/sprint-nodejs-ot/lessons/11098) 레슨을 참고하여 스프린트 미션을 업로드 해 주세요.
- [x] N-Sprint-Mission 레포지토리를 fork 합니다. (e.g. 2기면 2-Sprint-Mission)
- [x] 박규남-sprint1-2 브랜치를 생성하여 스프린트 미션 1에서 작성한 코드를 업로드 합니다.
- [x] Git 활용 과정에서 유닉스 커맨드를 활용해 주세요.  
  
  ```shell
  git clone -b 박규남 --single-branch https://github.com/gyunam-bark/2-sprint-mission.git
  cd 2-sprint-mission
  git branch 박규남-sprint1-2
  git switch 박규남-sprint1-2
  ```

- [x] README.md 파일을 작성해 주세요.
  - [x] 마크다운 언어를 숙지하여 작성해 주세요.
  - [x] 내용은 자유롭게 작성해 주세요.
- [x] 적절한 커밋 메시지를 남겨 주세요.  

  ```shell
  git commit -m "Submit mission 1 and 2."
  ```

- [x] GitHub에 PR\(Pull Request\)을 생성해 upstream의 본인 브랜치\(ex\)홍길동\)에 미션을 제출합니다.
- [x] PR 커멘트에 아래 내용들을 포함해 주세요.
  - [x] 스프린트 미션 요구사항 체크리스트
    - [x] 완료한 만큼 체크 표시를 해 주세요.
    - 예시
      ![예시](/resource/example.png)
    - [x] 주요 변경사항
    - [x] 멘토님에게 남길 메세지

### 심화
#### 미션 1
- [x] Article 클래스에 createdAt(생성일자) 프로퍼티를 만들어 주세요.
  - [x] 새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장합니다.

  [Article 클래스](/source/article/Article.mjs#L10-L22)  
  [getNow 메서드](/source/article/Article.mjs#L56-L61)

  > 테스트 결과, 서버에서 POST를 성공적으로 처리했을 때, 서버 시간으로 createAt, updatedAt 을 저장하기에 그것을 받아오는 메서드도 만들었습니다.   
  >
  > 단, createdAt은 미션지에 따라 사용하지는 않고 주석 처리되어 있습니다.  
  >
  > 서버 시간이 UTC Timezone 을 보정해서 확실하게 관리하는게 할 필요가 있다는 것을 알게 되었습니다.

## 스크린샷
![스크린샷](/resource/screenshot.png)

## 멘토에게
- esm 모듈을 사용한다고 명확하게 티내보려고 *.mjs 로 통일해보았습니다.

- Flutter 의 Freezed 가 멋져보여서 따라해보았습니다.
  *Request.mjs, *Response.mjs  
  
  **느낀 장점**  
  응답과 요청할 때 객체로 관리해서 toParameter(), toQuery() 로 필요에 따라 사용할 수 있어서 좋았습니다.  

  **느낀 단점**  
  코드 길이는 짧아졌으나 코드 개수는 늘어났다.   

  그래도 한번 만들고 수정하는 유지보수가 아닌 한 다시 열어볼 일이 없었기 때문에, 실제로는 이득이었다고 생각합니다.

- 실무 개발에서는 요청과 응답을 관리할 때 어떠한 방법을 자주 사용하는 지 궁금합니다.

- 처음에 toJson 으로 했다가, JSON.stringfy 에 대해서 학습 후 toJSON 으로 수정했습니다. 단순한 네이밍 취미가 아니었다니..! 

- 가능한 [API 문서](https://panda-market-api-crud.vercel.app/docs)의 Scheme 제한을 지키려고 노력했습니다.  

- 동시에 API 문서를 꼼꼼히 읽는 연습을 해보려고 Scheme 검증 코드를 작성해보았습니다.

- 에러가 났을 때 throw 를 할 것인지 console.error 를 할 것 인지 정말 많이 고민하고 수정했습니다.  
  어떤 면에서는 Scheme 이 올바르지 않으면 서버로 안 올리는 게 맞는 것 같고, 어떤 면에서는 서버의 데이터가 이상이 있어도 기본값이라고 넣어서 보여줘야 할 것 같고..  

  하지만, 백엔드니까 에러가 있을 때 아예 안 받고, 안 보내주는 게 맞겠다 싶어서 가능한 throw 로 처리했습니다.

- commit 메세지 적는 것이 아직은 어렵다고 느껴집니다.  
  commit 을 기능 단위로 만들어질 때마다 하면 좋았을 텐데, 흥과 텐션이 오르면 한번에 여러 기능을 만들고 커밋해서 커밋 메세지를 작성하는 경우가 많았습니다.

- 그래서 멘토링 때 봤던 axios 리퀘스트를 참고하려고 틈틈히 보고 있습니다.
  feat, fix 같은 분류를 지키니까 좀 더 적기 편해졌습니다!
