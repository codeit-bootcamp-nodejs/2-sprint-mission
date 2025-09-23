// src/articles/service.ts
import { PrismaClient, type Comment, type Article as ArticleModel } from '@prisma/client';
import NotificationService from '../notification/service';

export type CreateArticleDto = {
  title: string;
  content: string;
  image?: string;
};

export type UpdateArticleDto = {
  title?: string;
  content?: string;
  image?: string;
};

export default class ArticleService {
  constructor(private prisma: PrismaClient, private notif: NotificationService) {}

  /** 공개 목록 */
  async list(): Promise<ArticleModel[]> {
    return this.prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /** 단건 조회 */
  async getById(id: number): Promise<ArticleModel | null> {
    if (!Number.isFinite(id)) throw new Error('INVALID_ID');
    return this.prisma.article.findUnique({ where: { id } });
  }

  /** 게시글 생성 */
  async create(userId: number, dto: CreateArticleDto): Promise<ArticleModel> {
    if (!dto.title?.trim() || !dto.content?.trim()) throw new Error('TITLE_CONTENT_REQUIRED');
    return this.prisma.article.create({
      data: { userId, title: dto.title, content: dto.content, image: dto.image },
    });
  }

  /** 게시글 수정 */
  async update(id: number, dto: UpdateArticleDto): Promise<ArticleModel> {
    if (!Number.isFinite(id)) throw new Error('INVALID_ID');

    const exists = await this.prisma.article.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new Error('ARTICLE_NOT_FOUND');

    return this.prisma.article.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.image !== undefined ? { image: dto.image } : {}),
      },
    });
  }

  /** 게시글 삭제 */
  async remove(id: number): Promise<void> {
    if (!Number.isFinite(id)) throw new Error('INVALID_ID');

    const exists = await this.prisma.article.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new Error('ARTICLE_NOT_FOUND');

    await this.prisma.article.delete({ where: { id } });
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
