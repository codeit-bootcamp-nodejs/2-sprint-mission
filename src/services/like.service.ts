import { LikeParams } from "../types/like.types";
import LikeRepository from "../repositories/like.repository";
import { AuthenticationError } from "../utils/error";

export class Likeservice {
  /**
   * @description 좋아요 추가 또는 취소
   */
  static async toggleLike({ userId, relationType, relationId }: LikeParams) {
    if (!userId) throw new AuthenticationError();

    const isLiked = await LikeRepository.getUserLike({ userId, relationId, relationType });
    // 좋아요 상태에 따라 추가 또는 취소
    if (!isLiked) {
      // 좋아요 추가 로직
      return LikeRepository.postUserLike({ userId, relationId, relationType });
    } else {
      // 좋아요 취소 로직
      return LikeRepository.deleteUserLike({ isLiked });
    }
  }
}