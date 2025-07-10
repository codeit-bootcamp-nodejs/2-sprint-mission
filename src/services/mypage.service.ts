import {
  UpdateMyPageDto,
  UpdatePasswordDto,
  MyPageResponseDto,
  MyProductDto,
  MyArticleDto,
  MyCommentListResponseDto,
  MyLikedProductDto,
  MyLikedArticleDto,
} from "../utils/dtos/mypage.dto";
import bcrypt from "bcrypt";
import mypageRepository from "../repositories/mypage.repository";

const mypageService = {
  getMyInfo: async (userId: number): Promise<MyPageResponseDto> => {
    const user = await mypageRepository.getMyInfo(userId);
    return user;
  },

  updateMyInfo: async (
    userId: number,
    data: UpdateMyPageDto
  ): Promise<MyPageResponseDto> => {
    const updated = await mypageRepository.updateMyInfo(userId, data);
    return updated;
  },

  updatePassword: async (
    userId: number,
    data: UpdatePasswordDto
  ): Promise<void> => {
    const user = await mypageRepository.getPasswordByUserId(userId);

    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) {
      throw new Error("현재 비밀번호 일치하지 않음");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await mypageRepository.updatePassword(userId, hashedPassword);
  },

  getMyProducts: async (userId: number): Promise<MyProductDto[]> => {
    return await mypageRepository.getMyProducts(userId);
  },

  getMyArticles: async (userId: number): Promise<MyArticleDto[]> => {
    return await mypageRepository.getMyArticles(userId);
  },

  getMyComments: async (userId: number): Promise<MyCommentListResponseDto> => {
    const productComments = await mypageRepository.getMyProductComments(userId);
    const articleComments = await mypageRepository.getMyArticleComments(userId);

    return {
      productComments,
      articleComments,
    };
  },

  getMyLikedProducts: async (userId: number): Promise<MyLikedProductDto[]> => {
    return mypageRepository.getMyProductLikes(userId);
  },

  getMyArticleLikes: async (userId: number): Promise<MyLikedArticleDto[]> => {
    return mypageRepository.getMyArticleLikes(userId);
  },
};
export default mypageService;
