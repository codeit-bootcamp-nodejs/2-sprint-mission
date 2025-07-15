// src/service/product.service.ts
import { productRepository } from '../repositories/product.repository';
import { commentRepository } from '../repositories/comment.repository';
import NotFoundError from '../lib/errors/NotFoundError';
import { CreateProductInput, UpdateProductInput, ProductListQuery } from '../types/product.type';

// 제품 생성
export const createProduct = async (data: CreateProductInput): Promise<Product> => {
  const product = await productRepository.create(data);
  return product;
};

// 제품 조회
export const getProduct = async (id: number): Promise<Product> => {
  const product = await productRepository.findById(id);
  if (!product) throw new NotFoundError('product', id);
  return product;
};

// 제품 수정
export const updateProduct = async (
  id: number,
  data: UpdateProductInput
): Promise<Product> => {
  const existingProduct = await productRepository.findById(id);
  if (!existingProduct) throw new NotFoundError('product', id);

  const updated = await productRepository.update(id, data);
  return updated;
};

// 제품 삭제
export const deleteProduct = async (id: number): Promise<void> => {
  const product = await productRepository.findById(id);
  if (!product) throw new NotFoundError('product', id);

  await productRepository.delete(id);
};

// 제품 목록 조회
export const getProductList = async ({
  page,
  pageSize,
  orderBy,
  keyword,
}: ProductListQuery): Promise<{ list: Product[]; totalCount: number }> => {
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;

  const totalCount = await productRepository.count(where);
  const list = await productRepository.findAll({ page, pageSize, orderBy, where });

  return {
    list,
    totalCount,
  };
};

// 제품 댓글 생성
export const productCreateComment = async (
  productId: number,
  content: string
) => {
  const product = await productRepository.findById(productId);
  if (!product) throw new NotFoundError('product', productId);

  const comment = await commentRepository.create({ productId, content });
  return comment;
};

// 제품 댓글 목록 조회
export const getCommentList = async (
  productId: number,
  cursor: number | null,
  limit: number
) => {
  const product = await productRepository.findById(productId);
  if (!product) throw new NotFoundError('product', productId);

  const commentsWithCursor = await commentRepository.findAll({
    productId,
    cursor,
    limit,
  });

  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return {
    list: comments,
    nextCursor,
  };
};
