import { ProductRepository } from "../repositories/product.repository";
import HttpError from "../types/httpError";
import { ProductCreateDto, ProductUpdateDto, GetProductsQuery } from "../utils/dtos/products.dto";

export const ProductService = {
  getProducts: async (query: GetProductsQuery) => {
    const { page = 1, pageSize = 10, sort = "recent", search = "" } = query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };

    const orderBy = sort === "recent" ? { id: "desc" } : undefined;

    const products = await ProductRepository.findMany(
      where,
      skip,
      take,
      orderBy
    );

    return {
      page: Number(page),
      pageSize: Number(pageSize),
      products,
    };
  },

  createProduct: async (data: ProductCreateDto, userId: number) => {
    return await ProductRepository.create({
      ...data,
      userId,
    });
  },

  getProductById: async (productId: number, userId: number) => {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new HttpError(404);

    let isLiked = false;

    if (userId) {
      const like = await ProductRepository.findLike(userId, productId);
      isLiked = !!like;
    }

    return { product, isLiked };
  },

  updateProduct: async (id: number, data: ProductUpdateDto) => {
    const product = await ProductRepository.findById(id);
    if (!product) throw new HttpError(404);

    const updatedProduct = await ProductRepository.update(id, data);
    return updatedProduct;
  },

  deleteProduct: async (id: number) => {
    const product = await ProductRepository.findById(id);
    if (!product) throw new HttpError(404);

    await ProductRepository.delete(id);
  },

  toggleProductLike: async (userId: number, productId: number) => {
    const existingLike = await ProductRepository.findLike(userId, productId);

    if (existingLike) {
      await ProductRepository.deleteLike(userId, productId);
      return {
        message: "좋아요 취소 완료!",
        liked: false,
        userId,
        productId,
      };
    } else {
      await ProductRepository.createLike(userId, productId);
      return {
        message: "좋아요 완료!",
        liked: true,
        userId,
        productId,
      };
    }
  },
};
