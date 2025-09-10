import { UserRepository } from "../repositories/userReporitory";
import { ProductRepository } from "../repositories/productRepository";
import { ProductLikeRepository } from "../repositories/productLikeRepository";
import { Server as SocketIOServer } from "socket.io";
import { ArticleRepository } from "../repositories/articleReporitory";
import { ArticleLikeRepository } from "../repositories/articleLikeReporitory";
import { userSocketMap } from "../lib/socket";

export class LikeService {
  private io: SocketIOServer;
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private productLikeRepository: ProductLikeRepository;
  private articleRepository: ArticleRepository;
  private articleLikeRepository: ArticleLikeRepository;
  constructor(
    io: SocketIOServer,
    userRepository: UserRepository,
    productRepository: ProductRepository,
    productLikeRepository: ProductLikeRepository,
    articleRepository: ArticleRepository,
    articleLikeRepository: ArticleLikeRepository
  ) {
    this.io = io;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.productLikeRepository = productLikeRepository;
    this.articleRepository = articleRepository;
    this.articleLikeRepository = articleLikeRepository;
  }

  async updateProductLike(userId: number, productId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const existingLike =
      await this.productLikeRepository.checkingProductLikeStatus(
        userId,
        productId
      );
    let message: string;
    let isLiked: boolean;
    let likeCount: number;

    const userSocketId = userSocketMap.get(userId.toString());
    const userSocket = userSocketId
      ? this.io.sockets.sockets.get(userSocketId)
      : null;

    if (existingLike) {
      await this.productLikeRepository.deleteProductLike(existingLike.id);
      const updatedProduct = await this.productRepository.updateLikeDecrease(
        productId
      );
      message = "Product unliked successfully";
      isLiked = false;
      likeCount = updatedProduct.likeCount;

      if (userSocket) {
        userSocket.leave(productId.toString());
        console.log(`${userId} left product room ${productId}`);
      }
    } else {
      await this.productLikeRepository.uploadProductLike(userId, productId);
      const updatedProduct = await this.productRepository.updateLikeIncrease(
        productId
      );
      message = "Product liked successfully";
      isLiked = true;
      likeCount = updatedProduct.likeCount;
      if (userSocket) {
        userSocket.join(productId.toString());
        console.log(`${userId} joined product room ${productId}`);
      }
    }
    return { message, isLiked, likeCount };
  }

  async updateArticleLike(userId: number, articleId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    const existingLike =
      await this.articleLikeRepository.checkingArticleLikeStatus(
        userId,
        articleId
      );
    let message: string;
    let isLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      await this.articleLikeRepository.deleteArticleLike(existingLike.id);
      const updatedArticle = await this.articleRepository.updateLikeDecrease(
        articleId
      );
      message = "Article unliked successfully";
      isLiked = false;
      likeCount = updatedArticle.likeCount;
    } else {
      await this.articleLikeRepository.uploadArticleLike(userId, articleId);
      const updatedArticle = await this.articleRepository.updateLikeIncrease(
        articleId
      );
      message = "Article liked successfully";
      isLiked = true;
      likeCount = updatedArticle.likeCount;
    }
    return { message, isLiked, likeCount };
  }
}
