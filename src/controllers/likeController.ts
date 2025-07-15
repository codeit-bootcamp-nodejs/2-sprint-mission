import { Request, Response } from 'express';
import { likeService } from '../service/like.service';
import { create } from 'superstruct';
import { LikeInputStruct, GetLikedItemsQueryStruct } from '../structs/likesStruct';

// 좋아요 누르기 (또는 취소)
export async function toggleLike(req: Request, res: Response) {
  const userId = req.user.id; // userId 통일
  const data = create(req.body, LikeInputStruct); // 유효성 검사

  const result = await likeService.toggleLike({ ...data, userId });
  return res.status(200).send(result);
}

// 내가 좋아요한 항목 목록 조회 (상품/게시글 통합)
export const getLikedItems = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { targetType } = create(req.query, GetLikedItemsQueryStruct); // 유효성 검사

  const result = await likeService.getLikedItems(userId, targetType);
  return res.send(result);
};
