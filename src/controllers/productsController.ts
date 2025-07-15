import { Request, Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from '../structs/commentsStruct';
import * as productService from '../service/product.service';

// 제품 생성
export async function createProduct(req: Request, res: Response): Promise<Response> {
  const data = create(req.body, CreateProductBodyStruct);
  const result = await productService.createProduct(data);
  return res.status(201).send(result);
}

// 제품 조회
export async function getProduct(req: Request, res: Response): Promise<Response> {
  const { id } = create(req.params, IdParamsStruct) as { id: number };
  const result = await productService.getProduct(id);
  return res.send(result);
}

// 제품 수정
export async function updateProduct(req: Request, res: Response): Promise<Response> {
  const { id } = create(req.params, IdParamsStruct) as { id: number };
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct) as {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
  };
  const data = { name, description, price, tags, images };
  const result = await productService.updateProduct(id, data);
  return res.send(result);
}

// 제품 삭제
export async function deleteProduct(req: Request, res: Response): Promise<Response> {
  const { id } = create(req.params, IdParamsStruct) as { id: number };
  await productService.deleteProduct(id);
  return res.status(204).send();
}

// 제품 목록 조회
export async function getProductList(req: Request, res: Response): Promise<Response> {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct) as {
    page: number;
    pageSize: number;
    orderBy: 'recent' | 'old';
    keyword?: string;
  };
  const result = await productService.getProductList({ page, pageSize, orderBy, keyword });
  return res.send(result);
}

// 제품 댓글 생성
export async function createComment(req: Request, res: Response): Promise<Response> {
  const { id: productId } = create(req.params, IdParamsStruct) as { id: number };
  const { content } = create(req.body, CreateCommentBodyStruct) as { content: string };
  const result = await productService.productCreateComment(productId, content);

  return res.status(201).send(result);
}

// 제품 댓글 목록 조회
export async function getCommentList(req: Request, res: Response): Promise<Response> {
  const { id: productId } = create(req.params, IdParamsStruct) as { id: number };
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct) as {
    cursor: number | null;
    limit: number;
  };
  const result = await productService.getCommentList(productId, cursor, limit);
  return res.send(result);
}
