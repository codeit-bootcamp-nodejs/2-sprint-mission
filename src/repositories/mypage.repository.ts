import db from "../config/db";
import {
  UpdateMyPageDto,
  MyPageResponseDto,
  MyProductDto,
  MyArticleDto,
  MyProductCommentDto,
  MyArticleCommentDto,
  MyLikedProductDto,
  MyLikedArticleDto,
} from "../utils/dtos/mypage.dto";

const mypageRepository = {
  getMyInfo: async (userId: number): Promise<MyPageResponseDto> => {
    return await db.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });
  },

  updateMyInfo: async (
    userId: number,
    data: UpdateMyPageDto
  ): Promise<MyPageResponseDto> => {
    return await db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });
  },

  updatePassword: async (
    userId: number,
    hashedPassword: string
  ): Promise<void> => {
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  getPasswordByUserId: async (
    userId: number
  ): Promise<{ password: string }> => {
    return await db.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        password: true,
      },
    });
  },

  getMyProducts: async (userId: number): Promise<MyProductDto[]> => {
    return await db.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        createdAt: true,
      },
    });
  },

  getMyArticles: async (userId: number): Promise<MyArticleDto[]> => {
    return await db.article.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  getMyProductComments: async (
    userId: number
  ): Promise<MyProductCommentDto[]> => {
    return await db.productComment.findMany({
      where: { userId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        productId: true,
        userId: true,
      },
    });
  },

  getMyArticleComments: async (
    userId: number
  ): Promise<MyArticleCommentDto[]> => {
    return await db.articleComment.findMany({
      where: { userId: userId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        articleId: true,
        userId: true,
      },
    });
  },

  getMyProductLikes: async (userId: number): Promise<MyLikedProductDto[]> => {
    const result = await db.productLike.findMany({
      where: { userId },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    return result.map((like) => like.product);
  },

  getMyArticleLikes: async (userId: number): Promise<MyLikedArticleDto[]> => {
    const result = await db.articleLike.findMany({
      where: { userId },
      select: {
        article: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
    return result.map((like) => like.article);
  },
};

export default mypageRepository;
