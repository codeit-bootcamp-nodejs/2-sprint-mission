// src/modules/notifications/notifications.types.ts
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        user?: { id: number };
    }
}

// 1) 알림 종류(비즈니스 이벤트)
export type NotificationType = 'PRICE_CHANGE' | 'NEW_COMMENT';

// 2) 목적지 엔터티(클릭 시 어디로?)
export type EntityType = 'PRODUCT' | 'ARTICLE';

// 3) 쿼리 파라미터(페이지네이션)
export interface PaginationQuery {
    page?: number;   // default 1
    limit?: number;  // default 20, max 50
}

// 4) 단일 알림 DTO(프론트가 받는 형태)
export interface NotificationDTO {
    id: string; // BigInt → string (정밀도 보호)
    type: NotificationType;
    title: string;
    message: string | null;
    entity: { type: EntityType; id: string };
    isRead: boolean;
    createdAt: string; // ISO8601
}

// 5) 목록 응답 포맷(계약 고정)
export interface NotificationListResponse {
    items: NotificationDTO[];
    page: number;
    limit: number;
    total: number;
}

// 6) 미읽음 개수 응답
export interface UnreadCountResponse {
    unreadCount: number;
}

// 7) 읽음 처리 요청 바디
export interface MarkReadRequest {
    notificationIds: string[]; // BigInt → string
}

// 8) 서비스 입력용: 목록 조회 파라미터(내 알림만)
export interface NotificationListParams extends PaginationQuery {
    userId: number | bigint; // DB 스키마(number/bigint)에 맞춰 사용
}