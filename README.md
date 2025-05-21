## 변동사항
### 2025.05.13(화)
#### \[박규남\] sprint2
스프린트 미션 1 에서 작업한 코드를 스프린트 미션 2 를 통해 git 으로 제출합니다.

#### test 명령어
> npm run test  

```json
{
  "scripts": {
    "dev": "nodemon main.js",
    "test": "node main.js"
  },
}
```

##### 스크린샷
![스크린샷](/resource/screenshot.png)

##### 추가된 파일
```text
2-sprint-mission
├ resource
├ source
  ├ article
    ├ requests
      ├ ...request.mjs
    ├ resonses
      ├ ...response.mjs
    ├ Article.mjs
    ├ ArticleEnums.mjs
    ├ ArticleSchemeRequirements.mjs
  ├ product
    ├ requests
      ├ ...request.mjs
    ├ responses
      ├ ...response.mjs
    ├ ElectronicProduct.mjs 
    ├ Product.mjs
    ├ ProductCallbacks.mjs
    ├ ProductEnums
    ├ ProductSchemeRequirements.mjs
  ├ utility
    ├ SprintUtility.mjs
  ├ ArticleService.js
  ├ ProductService.js
├ main.js
├ package-loc.json
├ package.json
```

##### .gitignore
```text
/node_modules
```
불필요한 큰 모듈 파일들은 git 에 올라가지 않도록 .gitignore 를 작성했습니다.