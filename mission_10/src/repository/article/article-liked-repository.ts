import prisma from '../../utills/prisma';

class ArticleLikedRepository {
  static getArticleLiked = async (articleId: number, userId: number) => {
    const articleLiked = await prisma.articleLiked.findUnique({
      where: {
        userId_articleId: {
          userId: userId,
          articleId: articleId,
        },
      },
    });
    if (!articleLiked) {
      console.log('articleLiked not found');
      return null;
    }
    console.log(`articleLiked: ${articleLiked}`);
    return articleLiked;
  }

  static createArticleLiked = async (articleId: number, userId: number) => {
    const articleLiked = await prisma.articleLiked.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });
    return articleLiked;
  }

  static deleteArticleLiked = async (articleId: number, userId: number) => {
    const articleLiked = await prisma.articleLiked.delete({
      where: {
        userId_articleId: {
          userId: userId,
          articleId: articleId,
        },
      },
    });
    return articleLiked;
  }
}

export default ArticleLikedRepository;
