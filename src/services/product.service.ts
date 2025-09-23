import { CreateProductDto, ProductListQueryDto, UpdateProductDto } from "../dtos/product.dto";
import LikeRepository from "../repositories/like.repository";
import ProductRepository from "../repositories/product.repository";
import { LikeResponseType } from "../types/like.types";
import { AuthenticationError, NotFoundError } from "../utils/error";
import { sendNotification } from "../utils/socket";
import NotificationService from "./notification.service";

export default class ProductService {
  /**
 * @description 상품 등록
 */
  static async postProduct({ body, userId }: { body: CreateProductDto, userId: number | null }) {
    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");
    return await ProductRepository.postProduct({ body, userId });
  }

  /**
   * @description 상품 목록 조회
   */
  static async getProduct({ query, userId }: { query: ProductListQueryDto, userId: number | null }) {
    const { offset = 0, limit = 10, order = 'recent', search = '' } = query;
    const skip = parseInt(offset.toString(), 10);
    const take = parseInt(limit.toString(), 10);

    const where = search
      ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
      : {};

    // 상품 목록 조회
    const products = await ProductRepository.getProduct({ where, order, skip, take });

    // 현재 로그인한 사용자의 좋아요 정보 조회
    let userLikes: LikeResponseType[] = [];
    if (userId) {
      userLikes = await LikeRepository.getUserLikes({
        userId,
        products: products // 타입 캐스팅, 필요시 수정
      });
    }

    return products.map(product => {
      const isLiked = userLikes.some(like => like.productId === product.id);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
        nickname: product.user?.nickname || '', // 작성자 닉네임
        likeCount: product._count.isLiked, // 좋아요 수
        isLiked: isLiked // 현재 사용자의 좋아요 상태
      };
    });
  }

  /**
   * @description 상품 ID로 상품 조회
  */
  static async getProductById({ productId, userId }: { productId: number, userId: number | null }) {
    // 상품 ID로 상품 조회
    const product = await ProductRepository.getProductById(productId);
    if (!product) throw new NotFoundError("해당 상품을 찾을 수 없습니다.");

    // 현재 로그인한 사용자가 이 상품에 좋아요를 눌렀는지 확인
    let isLiked = false;
    if (userId) {
      const like = await LikeRepository.getUserLike({ userId, relationId: productId, relationType: 'products' });
      isLiked = !!like;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      nickname: product.user?.nickname || '', // 작성자 닉네임
      likeCount: product._count.isLiked, // 좋아요 수
      isLiked: isLiked // 현재 사용자의 좋아요 상태
    };
  }

  /**
    * @description 상품 정보 수정
   */
  static async patchProduct({ body, productId, userId }: { body: UpdateProductDto, productId: number, userId: number | null, }) {
    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    // 상품이 존재하는지 확인
    const product = await ProductRepository.getProductById(productId);
    if (!product) throw new NotFoundError("해당 상품을 찾을 수 없습니다.");

    // 상품 등록자만 수정 가능
    if (product.userId !== userId) throw new AuthenticationError("상품 수정 권한이 없습니다.");

    const likedUsers = await LikeRepository.getProductLikes({ productId });
    const oldPrice = product.price;

    if (body.price && oldPrice >= body.price) {
      for (const user of likedUsers) {
        const notification = await NotificationService.postNotification(user.id, `상품 ${product.name}의 가격이 변경되었습니다.`, "price_change");
        sendNotification(user.id, notification); // 소켓 알림 추가
      }
    }
    return await ProductRepository.patchProduct({ productId, body });
  }

  /**
     * @description 상품 삭제
     */
  static async deleteProduct({ userId, productId }: { userId: number | null; productId: number }) {
    // 로그인 여부 확인
    if (!userId) throw new AuthenticationError("로그인이 필요합니다.");

    // 상품 ID로 상품 조회
    const product = await ProductRepository.getProductById(productId);
    if (!product) throw new NotFoundError("해당 상품을 찾을 수 없습니다.");

    // 상품 등록자만 삭제 가능
    if (product.userId !== userId) throw new AuthenticationError("상품 삭제 권한이 없습니다.");

    return await ProductRepository.deleteProduct(productId);
  }
}
