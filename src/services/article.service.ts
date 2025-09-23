import { NotFoundError, AuthorizationError, AuthenticationError } from "../utils/error";
import ArticleRepository from "../repositories/article.repository";
import LikeRepository from "../repositories/like.repository";
import { ArticleListQueryDto, CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";
import { LikeResponseType } from "../types/like.types";

export default class ArticleService {
  /**
   * @description 게시글 등록
   */
  static async postArticle({ body, userId }: { body: CreateArticleDto, userId: number | null }) {
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");
    return await ArticleRepository.postArticle(body, userId);
  };

  /**
   * @description 게시글 목록 조회
   */
  static async getArticle({ query, userId }: { query: ArticleListQueryDto, userId: number | null }) {
    const { offset = 0, limit = 10, order = "recent", search = "" } = query;
    // offset과 limit을 정수로 변환
    const skip = parseInt(offset.toString(), 10);
    const take = parseInt(limit.toString(), 10);

    // 검색어가 있는 경우 조건 설정
    let where: object = search
      ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
      : {};

    // 조건에 따라 게시글 조회
    const articles = await ArticleRepository.getArticle({ where, order, skip, take });

    // 현재 로그인한 사용자의 좋아요 정보 조회
    let userLikes: LikeResponseType[] = [];
    if (userId) {
      userLikes = await LikeRepository.getUserLikes({ userId, articles }); // products는 빈 배열로 전달
    }

    // 게시글 목록에 좋아요 상태 추가
    return articles.map(article => {
      const isLiked = userLikes.some(like => like.articleId === article.id);
      return {
        id: article.id,
        title: article.title,
        content: article.content,
        createdAt: article.createdAt,
        nickname: article.user?.nickname || '', // 작성자 닉네임
        likeCount: article._count.isLiked, // 좋아요 수
        isLiked: isLiked // 현재 사용자의 좋아요 상태
      };
    });

  }

  /** 
   * @description 게시글 ID로 상세 조회
   */
  static async getArticleById({ articleId, userId }: { articleId: number, userId: number | null }) {
    // 게시글 ID로 게시글 조회
    const article = await ArticleRepository.getArticleById(articleId);
    if (!article) throw new NotFoundError("게시글이 존재하지 않습니다.");

    // 현재 로그인한 사용자가 이 게시글에 좋아요를 눌렀는지 확인
    let isLiked = false;
    if (userId) {
      const like = await LikeRepository.getUserLike({ userId, relationId:articleId, relationType: 'articles' });
      isLiked = !!like;
    }

    // 게시글 정보에 댓글 수와 좋아요 수 포함
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      nickname: article.user?.nickname, // 작성자 닉네임
      likeCount: article._count.isLiked, // 좋아요 수
      isLiked: isLiked // 현재 사용자의 좋아요 상태
    };
  }

  /**
   * @description 게시글 정보 수정
   */
  static async patchArticle({ body, articleId, userId }: { body: UpdateArticleDto, articleId: number, userId: number | null }) {
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");
    
    // 게시글 ID로 조회
    const article = await ArticleRepository.getArticleById(articleId);

    // 게시글이 존재하는지 확인
    if (!article) throw new NotFoundError("게시글이 존재하지 않습니다.");

    // 작성자 본인만 수정 가능
    if (article.userId !== userId) throw new AuthorizationError("게시글 수정 권한이 없습니다.");

    return ArticleRepository.patchArticle({ articleId, body });
  }

  /**
   * @description 게시글 삭제
   */
  static async deleteArticle({ articleId, userId }: { articleId: number, userId: number | null }) {
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");
    
    // 게시글 ID로 조회
    const article = await ArticleRepository.getArticleById(articleId);

    // 게시글이 존재하는지 확인
    if (!article) throw new NotFoundError("게시글이 존재하지 않습니다.");

    // 작성자 본인만 삭제 가능
    if (article.userId !== userId) throw new AuthorizationError("게시글 삭제 권한이 없습니다.");

    return ArticleRepository.deleteArticle(articleId);
  }
}
