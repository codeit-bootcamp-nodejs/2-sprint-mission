import { Likeservice } from "../services/like.service";
import { LikeDto } from "../dtos/like.dto";
import { getValidatedId } from "../utils/common";
import { Request, Response } from "express";
import { LikeResponseType } from "../types/like.types";

export class LikeController {
  /**
   * @description 좋아요 추가 또는 취소
   * @route POST :relationType/:id/like
   * 
   */
  static async toggleLike(req: Request, res: Response) {
    // DTO 생성
    const likeDto: LikeDto = {
      userId: req.user ? req.user.id : null,
      relationType: req.relationType || 'articles',
      relationId: getValidatedId(req.validatedId!)
    };

    // 좋아요 추가 또는 취소 서비스 호출
    const isLiked:LikeResponseType = await Likeservice.toggleLike(likeDto);
    res.status(201).json({ 
      message: isLiked ? '좋아요가 추가되었습니다.' : '좋아요가 취소되었습니다.',
      data: isLiked
    });
  }
}