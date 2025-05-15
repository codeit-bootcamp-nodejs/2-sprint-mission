### 🧩 NB2 sprint mission 1-2 

## 📝 미션 설명

`Article`와 `Product` 데이터를 처리하는 API 기능과 클래스 구조를 구현한 미션입니다.

### `ArticleService.js`
- Article API 관련 함수 구현 (GET, POST, PATCH, DELETE)
- `fetch`와 `.then()` 메소드를 활용한 비동기 처리
- `.catch()`를 사용한 오류 처리

### `ProductService.js`
- Product API 관련 함수 구현 (GET, POST, PATCH, DELETE)
- `async/await` 기반의 비동기처리
- `try/catch` 이용한 오류 처리

### `main.js`
- 주요 클래스:
  - `Product`: 기본 상품 클래스
  - `ElectronicProduct`: `Product`를 상속한 자식 클래스. 상품 태그에 `"전자제품"`이 포함된 경우 해당 클래스로 생성
  - `Article`: 기사 관련 정보 관리 클래스
- 각 클래스는 `constructor`로 초기화되며,
  - `Product`는 찜 수 증가 메서드 `favorite()` 포함
  - `Article`은 좋아요 수 증가 메서드 `like()` 및 생성 시점 기록용 `createdAt` 포함

### ✅기타 사항
-미션1과 미션2 함께 제출합니다.
