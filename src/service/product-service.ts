import { productRepository } from '../repository/product-repository';
import { getListProductQuery } from '../types/query';
import { CreateOrUpdateProduct } from '../types/product';
import { Prisma } from '@prisma/client';

export const productService = {
  async getDetail(id: number) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('NOT_FOUND');
    return product;
  },

  async getList(query: getListProductQuery) {
    const { name = '', description = '', offset = 0, limit = 10, order = 'newest' } = query;
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      order === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };
    return productRepository.findManyWithFilter({
      where: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { description: { contains: description, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
      orderBy,
      skip: Number(offset),
      take: Number(limit),
    });
  },

  async create(userId: number, body: CreateOrUpdateProduct) {

    const { name, description, price, tags } = body;
    if(!name || !description || !price || !tags){
      throw new Error('유효성 검증 에러');
    }
    return productRepository.create({ userId, name, description, price, tags });
  },

  async update(userId: number, id: number, data: CreateOrUpdateProduct) {
    if(!data.name || !data.description || !data.price || !data.tags){
      throw new Error('data are required')
    }

    if(!userId){
      throw new Error('UNAUTHORIZED');
    }
    
    const product = await productRepository.findById(id);
    if (!product) throw new Error('NOT_FOUND');
    if (product.userId !== userId) throw new Error('FORBIDDEN');
    return productRepository.update(id, data);
  },

  async remove(userId: number, id: number) {

    if(!userId){
      throw new Error('UNAUTHORIZED');
    }
    const product = await productRepository.findById(id);
    if (!product) throw new Error('NOT_FOUND');
    if (product.userId !== userId) throw new Error('FORBIDDEN');
    return productRepository.delete(id);
  },

  async like(userId: number, productId: number) {

    if(!userId){
      throw new Error('UNAUTHORIZED');
    }
    const product = await productRepository.findById(productId);
    if (!product) throw new Error('NOT_FOUND');

    const alreadyLike = await productRepository.findProductLike(userId, productId);
    if (alreadyLike) throw new Error('CONFLICT');

    return productRepository.createProductLike(userId, productId);
  },

  async cancelLike(userId: number, productId: number) {
    if(!userId){
      throw new Error('UNAUTHORIZED');
    }

    const product = await productRepository.findById(productId);
    if (!product) throw new Error('NOT_FOUND');

    const existLike = await productRepository.findProductLike(userId, productId);
    if (!existLike) throw new Error('NOT_LIKED');

    return productRepository.deleteProductLike(userId, productId);
  },

  async likesList(userId: number) {
     if(!userId){
      throw new Error('UNAUTHORIZED');
    }
    const likeProducts = await productRepository.findUserLikes(userId);
    const likeProductIds = likeProducts.map(lp => lp.productId);
    return productRepository.findProductsByIds(likeProductIds);
  },

  async isLiked(userId: number) {
    
    if(!userId){
      throw new Error('UNAUTHORIZED');
    }
    // 유저가 좋아요한 상품 id 전부 추출
    const productLikes = await productRepository.findUserLikes(userId); 

    
    if(productLikes.length === 0){
      throw new Error ("NOT_FOUND")
    }

    // 좋아요 id로 상품 id추출

    const likedProductIds = productLikes.map(pl => pl.productId);
    const allProducts = await productRepository.findAllProducts();
    return allProducts.map(product => ({
      ...product,
      isLiked: likedProductIds.includes(product.id),
    }));
  }
};
