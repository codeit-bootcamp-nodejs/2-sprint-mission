import { Prisma } from "@prisma/client";
import { ArticleRepository } from "../repositories/articleReporitory";
import { UserRepository } from "../repositories/userReporitory";
import { CommentDto } from "../dtos/comments.dto";
import { Server as SocketIOServer } from "socket.io";
import { ArticleCommentRepository } from "../repositories/articleCommentRepository";
import { NotificationService } from "./notification";

interface ArticleCommentOutput {
  id: number;
  content: string;
  userId: number;
  articleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ArticleCommentService {
  private io: SocketIOServer;
  private userRepository: UserRepository;
  private articleRepository: ArticleRepository;
  private articleCommentRepository: ArticleCommentRepository;
  private notificationService: NotificationService;
  constructor(
    io: SocketIOServer,
    userRepository: UserRepository,
    articleRepository: ArticleRepository,
    articleCommentRepository: ArticleCommentRepository,
    notificationService: NotificationService
  ) {
    this.io = io;
    this.userRepository = userRepository;
    this.articleRepository = articleRepository;
    this.articleCommentRepository = articleCommentRepository;
    this.notificationService = notificationService;
  }

  async createArticleComment(
    userId: number,
    articleId: number,
    commentData: CommentDto
  ): Promise<ArticleCommentOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    if (!commentData.content || commentData.content.trim().length === 0) {
      throw new Error("Comment content cannot be empty.");
    }

    const createData: Prisma.ArticleCommentCreateInput = {
      content: commentData.content,
      user: {
        connect: { id: userId },
      },
      article: {
        connect: { id: articleId },
      },
    };

    const newArticleComment = await this.articleCommentRepository.create(
      createData
    );

    /*
     * 알림 전송
     */
    // 게시글 작성자와 댓글 작성자가 다른 경우에 알림 전송
    if (article.userId !== userId) {
      const notificationMessage = `${user.nickname}님이 게시글에 댓글을 남겼습니다.`;

      // 게시글 작성자에게 알림
      await this.notificationService.createNotification(article.userId, {
        message: notificationMessage,
        type: "COMMENT",
        isRead: false,
      });
    }

    return { ...newArticleComment };
  }

  async updateArticleComment(
    userId: number,
    articleCommentId: number,
    updateComment: CommentDto
  ): Promise<ArticleCommentOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const articleComment = await this.articleCommentRepository.findById(
      articleCommentId
    );
    if (!articleComment) {
      throw new Error("Article comment not found");
    }

    if (articleComment.userId !== userId) {
      throw new Error("Unauthorized to update this article comment");
    }

    const articleCommentUpdateDate: Prisma.ArticleCommentUpdateInput = {
      content: updateComment.content,
    };

    const updateArticleComment = await this.articleCommentRepository.update(
      articleCommentId,
      articleCommentUpdateDate
    );

    return { ...updateArticleComment };
  }

  async deleteArticleComment(userId: number, articleCommentId: number) {
    const articleComment = await this.articleCommentRepository.findById(
      articleCommentId
    );
    if (!articleComment) {
      throw new Error("Article comment not found");
    }

    if (articleComment.userId !== userId) {
      throw new Error("You are not authorized to delete this article comment.");
    }

    await this.articleCommentRepository.delete(articleCommentId);

    return { message: "Article comment deleted successfully" };
  }
}
