// src/articles/service.ts
import { PrismaClient, type Comment, type Article as ArticleModel } from '@prisma/client';
import NotificationService from '../notification/service';

export type CreateArticleDto = {
  title: string;
  content: string;
  image?: string;
};

export default class ArticleService {
  constructor(private prisma: PrismaClient, private notif: NotificationService) {}

  /** 게시글 생성 */
  async create(userId: number, dto: CreateArticleDto): Promise<ArticleModel> {
    return this.prisma.article.create({
      data: { userId, title: dto.title, content: dto.content, image: dto.image },
    });
  }

  /** 댓글 생성 + 알림 트리거 */
  async addComment(articleId: number, commenterId: number, content: string): Promise<Comment> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { userId: true, title: true },
    });
    if (!article) throw new Error('ARTICLE_NOT_FOUND');

    const comment = await this.prisma.comment.create({
      data: { articleId, userId: commenterId, content },
    });

    await this.notif.notifyCommentAdded({
      articleId,
      authorUserId: article.userId,
      commenterId,
      commentContent: content,
      articleTitle: article.title,
    });

    return comment;
  }
}
