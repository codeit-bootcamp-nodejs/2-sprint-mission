## 요구사항

### 기본
#### 1. 공통 설정
- [x] PostgreSQL로 DB 구축
- [x] 각 모델 간 관계(onDelete) 옵션 정의
- [x] DB 시딩(seed) 코드 작성
- [x] 모든 API에 에러 처리 로직 포함
- [x] 모든 API에 적절한 HTTP 상태 코드 반환

#### 2. 중고 마켓(Product)
##### 2-1. 스키마
- [x] id, name, description, price, tags, createdAt, updatedAt 필드 정의
##### 2-2. API
- [x] 상품 등록 – name, description, price, tags 입력
- [x] 상품 상세 조회 – id, name, description, price, tags, createdAt 반환
- [x] 상품 수정 (PATCH)
- [x] 상품 삭제
- [x] 상품 목록 조회
  - [x] id, name, price, createdAt 반환 
  - [x] offset 페이지네이션
  - [x] 최신순(recent) 정렬
  - [x] name, description 검색 지원
- [x] 각 API에 에러 처리 & 상태 코드 적용
  
#### 3. 자유게시판(Article)
##### 3-1. 스키마
- [x] id, title, content, createdAt, updatedAt 필드 정의
##### 3-2. API
- [x] 게시글 등록 – title, content 입력
- [x] 게시글 상세 조회 – id, title, content, createdAt 반환
- [x] 게시글 수정 (PATCH)
- [x] 게시글 삭제
- [x] 게시글 목록 조회
  - [x] id, title, content, createdAt 반환 
  - [x] offset 페이지네이션
  - [x] 최신순(recent) 정렬
  - [x] title, content 검색 지원
- [x] 각 API에 에러 처리 & 상태 코드 적용

#### 4. 댓글(Comments)
##### 4-1. 스키마
- [x] id, content, createdAt 필드 정의
##### 4-2. API
- [x] 중고마켓
  - [x] 댓글 등록 – content 입력
  - [x] 댓글 수정 (PATCH)
  - [x] 댓글 삭제
  - [x] 댓글 목록 조회
    - [x] id, content, createdAt 반환 
    - [x] cursor 페이지네이션
    - [x] 중고마켓 별도 엔드포인트
- [x] 자유게시판
  - [x] 댓글 등록 – content 입력
  - [x] 댓글 수정 (PATCH)
  - [x] 댓글 삭제
  - [x] 댓글 목록 조회
    - [x] id, content, createdAt 반환 
    - [x] cursor 페이지네이션
    - [x] 자유게시판 별도 엔드포인트
- [x] 각 API에 에러 처리 & 상태 코드 적용

#### 5. 유효성 검증 & 미들웨어
- [x] 상품 등록 필드 검증 미들웨어
- [x] 게시글 등록 필드 검증 미들웨어
- [x] multer 기반 이미지 업로드 미들웨어
  - [x] 서버에 파일 저장
  - [x] 이미지 경로를 응답에 포함

#### 6. 에러 핸들러
- [x] Global error-handler 미들웨어 구현
  - [x] 5xx 서버 오류
  - [x] 4xx 사용자 입력 오류
  - [x] 404 리소스 없음

#### 7. 라우팅 구조
- [x] app.route() 로 동일 경로 메서드 통합
- [x] express.Router() 로 중고마켓/자유게시판 모듈화

#### 8. 배포 & 환경 설정
- [x] .env 에 환경 변수 관리
- [x] CORS 설정
- [x] render.com에 배포

</br>

## 멘토에게
- 매운맛🔥: 뒤는 없습니다. 그냥 필터 없이 말해주세요. 책임은 제가 집니다.