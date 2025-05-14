## 🌝 SPRINT MISSION 2  ( 25 / 05 / 13  수정)
>**NB 2기 강시연**


## 기술  
- **언어**: JavaScript  
- **라이브러리/프레임워크**: Node.js, Axios, fetch

## 기능 

- **`main.js`**  
  - 게시글과 상품을 처리하는 진입점  
  - `Product` 및 `ElectronicProduct`, `Article` 클래스 정의  
  - `Like(좋아요)` 및 `Favorite(즐겨찾기)` 기능  

- **`ArticleService.js`**  
  - 게시글(Article) 목록 조회  
  - 게시글 작성, 수정, 삭제 API 처리  

- **`ProductService.js`**  
  - 상품(Product) 목록 조회  
  - 상품 추가, 수정, 삭제 API 처리

- **`.gitignore`**  
  - `node_modules/`, `.vscode/` 등 개발 환경 관련 파일 제외 처리  


## 실행 방법

```bash
# 의존성 설치
npm install

# 실행
node class/main.js
