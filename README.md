# 🧾 Sprint5 TypeScript API Server

게시글과 제품(상품)에 대한 CRUD, 댓글, 좋아요, 이미지 업로드 기능이 구현된 백엔드 API 서버입니다.  
TypeScript 기반으로 작성되었으며 Express, Prisma, PostgreSQL을 사용했습니다.

---

## 📁 폴더 구조

src/
├── controllers/ # 요청 처리 컨트롤러
├── services/ # 비즈니스 로직
├── repositories/ # DB 쿼리 담당 (Prisma)
├── structs/ # 입력값 유효성 검사 (superstruct)
├── types/ # 공통 타입 정의 (TypeScript)
├── lib/
│ ├── prismaClient.ts # Prisma 인스턴스
│ └── errors/ # 커스텀 에러 정의

---

## 🧩 주요 기능

### 🔸 게시글(Article)
- 게시글 생성 / 조회 / 수정 / 삭제
- 게시글 목록 조회 (페이지네이션, 키워드 검색, 정렬)

### 🔸 제품(Product)
- 제품 등록 / 조회 / 수정 / 삭제
- 제품 목록 조회 (페이지네이션 + 키워드 검색)
- 제품 댓글 등록 / 목록 조회 (커서 기반 페이지네이션)

### 🔸 댓글(Comment)
- 게시글 댓글 생성 / 목록 조회 / 수정 / 삭제

### 🔸 좋아요(Like)
- 게시글 / 제품 좋아요 토글
- 내가 좋아요한 항목 조회

### 🔸 이미지 업로드
- 이미지 파일 업로드 (jpg/png/jpeg)

---

## 🛠 사용 기술

- **Language**: TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: superstruct
- **File Upload**: multer
- **Error Handling**: 커스텀 에러 클래스 + 미들웨어

---

## ▶ 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. .env 파일 설정
DATABASE_URL=postgresql://...

# 3. Prisma DB 마이그레이션
npx prisma migrate dev

# 4. 서버 실행
npm run dev
📡 API 예시
📍 [POST] /articles

{
  "title": "첫 글",
  "content": "내용입니다"
}
📍 [GET] /products?keyword=신발&page=1&pageSize=10
❗ 에러 처리
모든 에러는 전역 에러 핸들러에서 처리되며, 다음과 같은 구조로 응답합니다.


{
  "message": "Not Found"
}
에러 종류:

BadRequestError: 잘못된 요청 (400)

NotFoundError: 리소스 없음 (404)

UnauthorizedError: 인증 실패 (401)

🔮 향후 개선 사항
유저 인증/인가 강화

Swagger 또는 Postman API 문서 자동화

테스트 코드 도입

Docker 배포 환경 구성
