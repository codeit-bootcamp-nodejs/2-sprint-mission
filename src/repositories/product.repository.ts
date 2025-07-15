import { prismaClient } from '../lib/prismaClient';

export const productRepository = {
  // 제품 생성
  create: (data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
  }) => {
    return prismaClient.product.create({ data });
  },

  // 제품 조회
  findById: (id: number) => {
    return prismaClient.product.findUnique({ where: { id } });
  },

  // 제품 수정
  update: (id: number, data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
  }) => {
    return prismaClient.product.update({ where: { id }, data });
  },

  // 제품 삭제
  delete: (id: number) => {
    return prismaClient.product.delete({ where: { id } });
  },

  // 제품 목록 조회
  findAll: ({
    page,
    pageSize,
    orderBy,
    where,
  }: {
    page: number;
    pageSize: number;
    orderBy: 'recent' | 'old';
    where?: any;
  }) => {
    return prismaClient.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
    });
  },

  // 총 개수
  count: (where?: any) => {
    return prismaClient.product.count({ where });
  },
};
