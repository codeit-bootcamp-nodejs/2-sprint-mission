import { Request, Response, NextFunction } from "express";
import mypageService from "../services/mypage.service";
import { UpdateMyPageDto, UpdatePasswordDto } from "../utils/dtos/mypage.dto";

const mypageController = {
  // 내 정보 조회
  getMyInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const myInfo = await mypageService.getMyInfo(userId);
      res.status(200).json({message: '내 정보', myInfo});
    } catch (error) {
      next(error);
    }
  },

  // 내 정보 수정
  updateMyInfo: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: UpdateMyPageDto = req.body;
      const updated = await mypageService.updateMyInfo(userId, data);
      res.status(200).json({ message: "수정 완료", updated });
    } catch (error) {
      next(error);
    }
  },

  // 비밀번호 변경
  updatePassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: UpdatePasswordDto = req.body;
      await mypageService.updatePassword(userId, data);
      res.status(200).json({ message: "비밀번호 변경 완료" });
    } catch (error) {
      next(error);
    }
  },

  // 내가 등록한 상품 목록 조회
  getMyProcuts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const products = await mypageService.getMyProducts(userId);

      res
        .status(200)
        .json({ message: "등록한 상품 목록", products });
    } catch (error) {
      next(error);
    }
  },

  // 내가 작성한 게시글 목록 조회
  getMyArticles: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const articles = await mypageService.getMyArticles(userId);

      res
        .status(200)
        .json({ message: "작성한 게시글 목록", articles });
    } catch (error) {
      next(error);
    }
  },

  // 내가 작성한 댓글 목록 조회
  getMyComments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const comments = await mypageService.getMyComments(userId);

      res
        .status(200)
        .json({ message: "작성한 댓글 목록", comments });
    } catch (error) {
      next(error);
    }
  },

  // 내가 좋아요 한 상품 목록
  getMyLikedProducts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const productsLikes = await mypageService.getMyLikedProducts(userId);
      res.status(200).json({ message: "상품 좋아요 목록", productsLikes });
    } catch (error) {
      next(error);
    }
  },

  // 내가 좋아요 한 게시글 목록
  getMyLikedArticles: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const articlesLikes = await mypageService.getMyArticleLikes(userId);
      res.status(200).json({ message: "게시글 좋아요 목록", articlesLikes });
    } catch (error) {
      next(error);
    }
  },
};

export default mypageController;
