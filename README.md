
# 📌 스프린트 미션 8 – 알림 기능

## 🚀 프로젝트 개요

* **목표**: 알림(Notification) 기능 구현 + 실시간(Socket.IO) 기능
* **주요 기능**

  * 알림 목록 조회
  * 안 읽은 알림 개수 조회
  * 알림 읽음 처리
  * 실시간 알림 수신 (Socket.IO)
  * 조건 알림

    * 좋아요 한 상품의 가격 변동 시
    * 내가 쓴 게시글에 댓글 달릴 시

---

## 📂 구현 현황

| 기능                | 구현 여부 | 비고               |
| ----------------- | ----- | ---------------- |
| 알림 목록 조회 API      | ✅     | 기본 GET 동작        |
| 안 읽은 알림 개수 조회 API | ⚠️ 일부 | 기본 로직만 작성        |
| 알림 읽음 처리 API      | ⚠️ 일부 | 오너십 검증/응답 구조 미완성 |
| 실시간 알림(Socket.IO) | ❌ 미완  | 연결 코드 초안까지만      |
| 가격 변동 알림          | ❌ 미완  | 좋아요 연동 안됨        |
| 댓글 알림             | ❌ 미완  | 서비스/레포지토리 연동 필요  |

---

## 📡 API 엔드포인트

### 1) 알림 목록 조회

```
GET /notifications?page=1&limit=20
```

응답 예시:

```json
{
  "items": [
    {
      "id": 1,
      "type": "NEW_COMMENT",
      "title": "새 댓글이 달렸어요",
      "entityType": "ARTICLE",
      "entityId": 3,
      "isRead": false,
      "createdAt": "2025-08-23T12:00:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 12
}
```

### 2) 안 읽은 알림 개수 조회

```
GET /notifications/unread-count
```

응답 예시:

```json
{ "unreadCount": 5 }
```

### 3) 알림 읽음 처리

```
PATCH /notifications/:id/read
```

응답 예시:

```json
{ "id": 1, "isRead": true }
```

---

## ⚡ 실시간 알림 (예정)

* 네임스페이스: `/notifications`
* 이벤트명:

  * `notification:new` → 새 알림 전달
  * `notification:ping` → 연결 확인

---

## 🛠 실행 방법

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 설정 (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3000
```

3. 서버 실행

```bash
npm run dev
```

---

## 🧪 테스트 방법

* **목록 조회**: `GET http://localhost:3000/notifications`
* **미읽음 개수**: `GET http://localhost:3000/notifications/unread-count`
* **읽음 처리**: `PATCH http://localhost:3000/notifications/1/read`

(Postman / Thunder Client 등으로 확인)

---

## 📌 Definition of Done (목표)

* REST API 3종(목록/개수/읽음) 정상 동작
* Socket.IO 연결 및 알림 emit
* 가격 변동/댓글 알림 발생 시 DB insert + 실시간 emit
* 오프라인 복구 및 다중 탭 대응

---

🔮 추후 계획

현재는 시간 관계상 일부 기능만 구현되었습니다.

실시간 알림, 가격 변동/댓글 알림 등은 추후 다시 구현 및 보완할 예정입니다.