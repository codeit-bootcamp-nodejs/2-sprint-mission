# 📚 2-Sprint Mission3 Backend API

## 🚀 프로젝트 개요
이 프로젝트는 중고마켓 및 자유게시판 기능을 제공하는 백엔드 API 서버입니다. PostgreSQL 데이터베이스와 Prisma ORM을 사용하여 데이터를 관리하며, Node.js(Express) 기반으로 구현되었습니다. 이미지 업로드, 유효성 검증, 에러 처리 등의 고급 기능도 포함하고 있습니다.

## 🌐 배포 URL
서비스는 Render.com에 배포되어 있으며, 다음 URL을 통해 접근할 수 있습니다.
[https://two-sprint-mission3-market-backend.onrender.com](https://two-sprint-mission3-market-backend.onrender.com)

## 📝 API 문서

### 1. 중고마켓 상품 API

#### 1.1 상품 등록

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/products`

- **메서드:** `POST`

- **요청 바디 (JSON):** 
```json
{
  "name": "아이폰 15 (새 상품)",
  "description": "새롭게 출시된 아이폰 15, 미개봉 상품입니다.",
  "price": 1200000,
  "tags": ["스마트폰", "애플", "새상품"]
}
```

- **성공 응답 (201 Created):**
```json
{
    "id": 1,
    "name": "아이폰 15 (새 상품)",
    "description": "새롭게 출시된 아이폰 15, 미개봉 상품입니다.",
    "price": 1200000,
    "tags": [
        "스마트폰",
        "애플",
        "새상품"
    ],
    "imageUrl": null,
    "createdAt": "2025-05-27T09:27:02.100Z",
    "updatedAt": "2025-05-27T09:27:02.100Z"
}
```

#### 1.2 상품 목록 조회

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/products?search=아이폰`

- **메서드:** `GET`

- **성공 응답 (200 OK):**
```json
[
    {
        "id": 1,
        "name": "아이폰 15 (새 상품)",
        "price": 1200000,
        "createdAt": "2025-05-27T09:27:02.100Z"
    }
]
```

#### 1.3 상품 상세 조회

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/products/1`

- **메서드:** `GET`

- **성공 응답 (200 OK):**
```json
{
    "id": 1,
    "name": "아이폰 15 (새 상품)",
    "description": "새롭게 출시된 아이폰 15, 미개봉 상품입니다.",
    "price": 1200000,
    "tags": [
        "스마트폰",
        "애플",
        "새상품"
    ],
    "imageUrl": null,
    "createdAt": "2025-05-27T09:27:02.100Z",
    "updatedAt": "2025-05-27T09:27:02.100Z"
}
```

#### 1.4 상품 수정

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/products/1`

- **메서드:** `PATCH`

- **요청 바디 (JSON):**
```json
{
  "price": 1150000,
  "description": "가격 인하! 새롭게 출시된 아이폰 15, 미개봉 상품입니다."
}
```

- **성공 응답 (200 OK):**
```json
{
    "id": 1,
    "name": "아이폰 15 (새 상품)",
    "description": "가격 인하! 새롭게 출시된 아이폰 15, 미개봉 상품입니다.",
    "price": 1150000,
    "tags": [
        "스마트폰",
        "애플",
        "새상품"
    ],
    "imageUrl": null,
    "createdAt": "2025-05-27T09:27:02.100Z",
    "updatedAt": "2025-05-27T09:45:21.947Z"
}
```

#### 1.5 상품 삭제

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/products/1`

- **메서드:** `DELETE`

- **성공 응답 (204 No Content):**

### 2. 자유게시판 API

#### 2.1 게시글 등록 

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles`

- **메서드:** `POST`

- **요청 바디 (JSON):**
```json
{
  "title": "첫 번째 게시글 제목",
  "content": "이것은 첫 번째 게시글의 내용입니다. 반가워요!"
}
```

- **성공 응답 (201 Created):**
```json
{
    "id": 2,
    "title": "첫 번째 게시글 제목",
    "content": "이것은 첫 번째 게시글의 내용입니다. 반가워요!",
    "createdAt": "2025-05-27T09:56:46.469Z",
    "updatedAt": "2025-05-27T09:56:46.469Z"
}
```

#### 2.2 게시글 목록 조회

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles?offset=0&limit=3`

- **메서드:** `GET`

- **성공 응답 (200 OK):**
```json
[
    {
        "id": 1,
        "title": "첫 번째 게시글 제목",
        "content": "이것은 첫 번째 게시글의 내용입니다. 반가워요!",
        "createdAt": "2025-05-27T09:50:40.511Z",
        "updatedAt": "2025-05-27T09:50:40.511Z"
    }
]
```

#### 2.3 게시글 상세 조회

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/1`

- **메서드:** `GET`

- **성공 응답 (200 OK):**
```json
{
    "id": 1,
    "title": "첫 번째 게시글 제목",
    "content": "이것은 첫 번째 게시글의 내용입니다. 반가워요!",
    "createdAt": "2025-05-27T09:50:40.511Z",
    "updatedAt": "2025-05-27T09:50:40.511Z"
}
```

#### 2.4 게시글 수정

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/1`

- **메서드:** `PATCH`

- **요청 바디 (JSON):**
//```json
//{
//  "content": "수정된 게시글 내용입니다."
//}
//```
//- **실패 응답 (400
//Bad Request):** 


```json
{
  "title": "수정된 게시글 제목입니다.",
  "content": "수정된 게시글 내용입니다."
}
```

- **성공 응답 (200 OK):**
```json
{
    "id": 1,
    "title": "수정된 게시글 제목입니다.",
    "content": "수정된 게시글 내용입니다.",
    "createdAt": "2025-05-27T09:50:40.511Z",
    "updatedAt": "2025-05-27T10:05:00.005Z"
}
```

#### 2.5 게시글 삭제

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/1`

- **메서드:** `DELETE`

- **성공 응답 (204 No Content):**

### 3. 댓글 API

#### 3.1 댓글 등록

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/2/comments`

- **메서드:** `POST`

- **요청 바디 (JSON):**
```json
{
  "content": "이 상품 정말 마음에 들어요!"
}
```

- **성공 응답 (201 Created):**
```json
{
    "id": 1,
    "content": "이 상품 정말 마음에 들어요!",
    "createdAt": "2025-05-27T10:39:30.339Z",
    "updatedAt": "2025-05-27T10:39:30.339Z",
    "productId": null,
    "articleId": 2
}
```

#### 3.2 댓글 목록

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/2/comments`

- **메서드:** `GET`

- **성공 응답 (200 OK) :**
```json
[
    {
        "id": 1,
        "content": "이 상품 정말 마음에 들어요!",
        "createdAt": "2025-05-27T10:39:30.339Z",
        "updatedAt": "2025-05-27T10:39:30.339Z",
        "productId": null,
        "articleId": 2
    }
]
```

#### 3.3 댓글 수정

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/2/comments/3`

- **메서드:** `PATCH`

- **요청 바디 (JSON):**
```json
{
  "content": "이것은 2번 게시글의 3번 댓글에 대한 최종 수정 내용입니다!"
}
```

- **성공 응답 (200 OK):**
```json
{
    "id": 3,
    "content": "이것은 2번 게시글의 3번 댓글에 대한 최종 수정 내용입니다!",
    "createdAt": "2025-05-27T10:52:01.220Z",
    "updatedAt": "2025-05-27T11:00:28.681Z",
    "productId": null,
    "articleId": 2
}
```

#### 3.4 댓글 삭제

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/articles/2/comments/3`

- **메서드:** `DELETE`

- **성공 응답 (204 No Content):**


### 4. 이미지 API

#### 4.1 이미지 업로드

- **URL** `https://two-sprint-mission3-market-backend.onrender.com/api/upload`

- **메서드:** `POST`

- **성공 응답 (200 OK):**
```json
{
    "message": "이미지 업로드 성공!",
    "fileName": "1748343918210-P20180815_132404734_438A3C67-C042-440B-A817-4AB047A3C41D.PNG",
    "filePath": "/uploads/1748343918210-P20180815_132404734_438A3C67-C042-440B-A817-4AB047A3C41D.PNG"
}
```
