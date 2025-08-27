import { emitNotification, emitUnreadCount } from "../sockets";
import {
  CreateInput,
  ReadMarkedInput,
  ListQuery,
} from "../utils/dtos/notify.dto";
import notifyRepository from "../repositories/notify.repository";

const notifyService = {
  // 알림 리스트 조회
  notifyList: async (userId: number, { page, size, isRead }: ListQuery) => {
    return notifyRepository.notifyList(userId, { page, size, isRead });
  },

  // 읽지 않은 알림 갯수
  unreadCount: async (userId: number) => {
    return notifyRepository.countUnread(userId);
  },

  // 읽음 처리
  readMarked: async (userId: number, input: ReadMarkedInput) => {
    const { readCount, invalidIds } = await notifyRepository.readMarked(
      userId,
      input
    );

    // 권한 없는 알림 ID 검사
    if (invalidIds.length > 0) {
      throw {
        status: 403,
        message: "권한이 없는 알림이 포함되어 있습니다.",
        detail: { invalidIds },
      };
    }

    // 갱신 결과 확인
    if (readCount === 0) {
      throw { status: 404, message: "갱신할 알림이 없습니다." };
    }

    // 실시간 동기화(소켓 관련 메서드)
    await emitUnreadCount(userId);
    return { readCount, invalidIds };
  },

  // 생성 + 실시간 전송 (새 알림 & 읽지 않은 알림 카운트)
  // 알림 생성 후 소켓 브로드캐스트까지 수행
  createAndEmit: async (input: CreateInput) => {
    const result = await notifyRepository.createNotification(input.userId, {
      type: input.type,
      title: input.title,
      message: input.message,
      meta: input.meta,
    });

    // 해당 유저에게 새 알림 이벤트 푸시
    emitNotification(input.userId, {
      id: result.id,
      type: result.type,
      title: result.title,
      message: result.message,
      meta: result.meta,
      createdAt: result.createdAt,
    });

    // 읽음 처리 후, 클라이언트와 읽지 않은 알림 수를 실시간 동기화
    await emitUnreadCount(input.userId);

    return result;
  },
};

export default notifyService;
