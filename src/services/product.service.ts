import productRepository from "../repositories/product.repository";
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from "../utils/dtos/product.dto";

const productService = {
  createProduct: async (userId: number, data: CreateProductDto) => {
    return await productRepository.createProduct(userId, data);
  },

  getAllProducts: async (query: any): Promise<ProductResponseDto[]> => {
    return await productRepository.getAllProducts(query);
  },

  getProductById: async (productId: number): Promise<ProductResponseDto> => {
    return await productRepository.getProductById(productId);
  },

  updateProduct: async (
    userId: number,
    productId: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> => {
    return await productRepository.updateProduct(userId, productId, data);
  },

  deleteProduct: async (userId: number, productId: number): Promise<void> => {
    await productRepository.deleteProduct(userId, productId);
  },

  likeProduct: async (userId: number, productId: number) => {
    const existing = await productRepository.hasLikedProduct(userId, productId);
    if (existing) {
      throw new Error("이미 좋아요 했음");
    }

    return await productRepository.likeProduct(userId, productId);
  },

  unlikeProduct: async (userId: number, productId: number) => {
    return await productRepository.unlikeProduct(userId, productId);
  },
};

export default productService;
