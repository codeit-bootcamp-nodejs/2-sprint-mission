import { CommentListQueryDto } from "../dtos/comment.dto";
import ArticleRepository from "../repositories/article.repository";
import { CommentRepository } from "../repositories/comment.repository";
import ProductRepository from "../repositories/product.repository";
import { CommentParamType } from "../types/comment.type";
import { AuthenticationError, NotFoundError } from "../utils/error";
import { sendNotification } from "../utils/socket";
import NotificationService from "./notification.service";

export class CommentService {
  /**
   * @description 게시글 / 상품 댓글 등록
  */
  static async postArticleComment({ content, relationId, userId }: CommentParamType) {
    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    // 게시글 ID로 게시글 조회
    const article = await ArticleRepository.getArticleById(relationId);
    if (!article) throw new NotFoundError("게시글이 존재하지 않습니다.");

    const author = await ArticleRepository.getArticleAuthor(relationId);
    if (!author?.user) throw new NotFoundError("작성자가 존재하지 않습니다.");

    // 알림 생성
    if (author.user.id !== userId) {
      const notification = await NotificationService.postNotification(author.user.id, `${userId}님이 게시글에 댓글을 남겼습니다.`, "comment");
      sendNotification(author.user.id, notification); // 소켓 알림 추가
    }
    // 게시글이 존재하는 경우 댓글 등록
    return await CommentRepository.postArticleComment({
      content,
      relationId,
      userId
    });
  }

  /**
  * @description 상품 댓글 등록
  */
  static async postProductComment({ content, relationId, userId }: CommentParamType) {
    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    // 상품 ID로 상품 조회
    const product = await ProductRepository.getProductById(relationId);
    if (!product) throw new NotFoundError("상품이 존재하지 않습니다.");

    return await CommentRepository.postProductComment({
      content,
      relationId,
      userId
    });
  }

  /**
   * @description 게시글 댓글 조회
   */
  static async getArticleComments(commentDto: CommentListQueryDto) {
    const { relationId } = commentDto;
    // 게시글 ID로 게시글 조회
    const article = await ArticleRepository.getArticleById(relationId);
    if (!article) throw new NotFoundError("게시글이 존재하지 않습니다.");
    // 게시글이 존재하는 경우 댓글 조회
    return await CommentRepository.getArticleComments(commentDto);
  }

  /**
   * @description 상품 댓글 조회
   */
  static async getProductComments(commentDto: CommentListQueryDto) {
    const { relationId } = commentDto;
    // 상품 ID로 상품 조회
    const product = await ProductRepository.getProductById(relationId);
    if (!product) throw new NotFoundError("상품이 존재하지 않습니다.");

    // 상품이 존재하는 경우 댓글 조회
    return await CommentRepository.getProductComments(commentDto);
  }

  /**
   * @description 댓글 수정
   */
  static async patchComment({ content, userId, commentId }: { content: string; userId: number | null; commentId: number }) {

    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    // 댓글 ID로 댓글 조회
    const comment = await CommentRepository.findComment(commentId);

    // 댓글이 존재하는지 확인
    if (!comment) throw new NotFoundError("댓글이 존재하지 않습니다.");

    // 댓글 작성자만 수정 가능
    if (comment.userId !== userId) throw new AuthenticationError("댓글 작성자만 수정할 수 있습니다.");

    // 댓글 수정
    return await CommentRepository.patchComment(commentId, content);
  }

  /**
   * @description 댓글 삭제
   */
  static async deleteComment({ userId, commentId }: { userId: number | null; commentId: number }) {
    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    // 댓글 ID로 댓글 조회
    const comment = await CommentRepository.findComment(commentId);

    // 댓글이 존재하는지 확인
    if (!comment) throw new NotFoundError("댓글이 존재하지 않습니다.");

    // 댓글 작성자만 삭제 가능
    if (comment.userId !== userId) throw new AuthenticationError("댓글 작성자만 삭제할 수 있습니다.");

    // 댓글 삭제
    return CommentRepository.deleteComment(commentId);
  }
}