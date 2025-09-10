import { Prisma } from "@prisma/client";
import { UserRepository } from "../repositories/userReporitory";
import { CommentDto } from "../dtos/comments.dto";
import { Server as SocketIOServer } from "socket.io";
import { ProductRepository } from "../repositories/productRepository";
import { ProductCommentRepository } from "../repositories/productCommentRepository";

interface ProductCommentOutput {
  id: number;
  content: string;
  userId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductCommentService {
  private io: SocketIOServer;
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private productCommentRepository: ProductCommentRepository;

  constructor(
    io: SocketIOServer,
    userRepository: UserRepository,
    productRepository: ProductRepository,
    productCommentRepository: ProductCommentRepository
  ) {
    this.io = io;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.productCommentRepository = productCommentRepository;
  }
  async createProductComment(
    userId: number,
    productId: number,
    commentData: CommentDto
  ): Promise<ProductCommentOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!commentData.content || commentData.content.trim().length === 0) {
      throw new Error("Comment content cannot be empty.");
    }

    const createData: Prisma.ProductCommentCreateInput = {
      content: commentData.content,
      user: {
        connect: { id: userId },
      },
      product: {
        connect: { id: productId },
      },
    };

    const newProductComment = await this.productCommentRepository.create(
      createData
    );
    return { ...newProductComment };
  }

  async updateProductComment(
    userId: number,
    productCommentId: number,
    updateData: CommentDto
  ): Promise<ProductCommentOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const productComment = await this.productCommentRepository.findById(
      productCommentId
    );
    if (!productComment) {
      throw new Error("Product comment not found");
    }

    if (productComment.userId !== userId) {
      throw new Error("Unauthorized to update this product comment");
    }

    const productCommentUpdateData: Prisma.ProductCommentUpdateInput = {
      content: updateData.content,
    };

    const updateProductComment = await this.productCommentRepository.update(
      productCommentId,
      productCommentUpdateData
    );

    return { ...updateProductComment };
  }

  async deleteProductComment(userId: number, productCommentId: number) {
    const productComment = await this.productCommentRepository.findById(
      productCommentId
    );
    if (!productComment) {
      throw new Error("Product comment not found");
    }

    if (productComment.userId !== userId) {
      throw new Error("You are not authorized to delete this product comment.");
    }

    await this.productCommentRepository.delete(productCommentId);

    return { message: "Product comment deleted successfully" };
  }
}
