import express from 'express';
import { assert, is, StructError } from 'superstruct';
import prisma from '../../utills/prisma.js';
import { 
  CreateProduct,
  PatchProduct,
} from '../../structs.js';
import passport from '../../lib/passport/index.js';
import { optionalAuth } from '../../utills/auth.js';

const productRouter = express.Router();

productRouter.get('/', optionalAuth, getProducts);
productRouter.get('/:id', optionalAuth, getProductById);
productRouter.post('/', 
  passport.authenticate('access-token', { session: false }), 
  createProduct);
productRouter.patch('/:id', 
  passport.authenticate('access-token', { session: false }),
  updateProduct);
productRouter.delete('/:id',
  passport.authenticate('access-token', { session: false }),
  deleteProduct);

async function getProducts(req, res, next) {
  const { offset = 0, limit = 10, sort = 'recent', search = ''} = req.query;
  let orderBy;
  switch(sort) {
    case 'recent':
      orderBy = { createdAt: 'desc' };
      break;
    case 'former':
      orderBy = { createdAt: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc'};
  }
  const product = await prisma.product.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' }},
        { description: { contains: search, mode: 'insensitive' }},
      ],
    },
    select: {
      id: true,
      name: true, 
      description: false,
      price: true,
      tags: false,
      createdAt: true,
      updatedAt: false,
      productLiked: true,
    },
  });
  if (product.length === 0) {
    return res.status(200).json({ message: `${search}로 검색된 게시글이 없습니다. (offset: ${offset})` });
  }
  
  const response = product.map((product) => {
    let isLiked = false;
    if (req.user) {
      isLiked = product.productLiked.some((liked) => liked.userId === req.user.id);
    }
    const productData = {
      ...product,
      isLiked: isLiked
    };
    delete productData.productLiked;
    return productData;
  });
  
  return res.status(200).json(response);
}

async function createProduct(req, res, next) {
  try {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: {
        ...req.body,
        userId: req.user.id
      },
    });
    res.send(product);
  } catch (err) {
    return next(err);
  }
}


async function getProductById(req, res, next) {
  const id = parseInt(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id: id },
    select: {
    id: true,
    name: true, 
    description: true,
    price: true,
    tags: true,
    createdAt: true,
    updatedAt: false,
    productLiked: true,
    },
  });
  if (!product) {
    const err = new Error('product를 찾을 수 없습니다.');
    err.status = 404;
    return next(err);
  }
  let isLiked = false;
  if (req.user) {
    isLiked = product.productLiked.some((liked) => liked.userId === req.user.id);
  }
  const response = {
    ...product,
    isLiked: isLiked,
  }
  delete response.productLiked;
  res.json(response);
}


async function updateProduct(req, res, next) {
    try {
      assert(req.body, PatchProduct);
      const id = parseInt(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        const err = new Error('product를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (product.userId !== req.user.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      const updatedProduct = await prisma.product.update({
        where: { id: id },
        data: req.body,
      });
      res.send(updatedProduct);
    } catch (err) {
      return next(err);
    }
}


async function deleteProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      const err = new Error('product를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    if (product.userId !== req.user.id) {
      const err = new Error('인증되지 않은 사용자입니다.');
      err.status = 401;
      return next(err);
    }
    await prisma.product.delete({
      where: { id: id },
    });
    res.sendStatus(204);
  } catch (err) {
    if (err.code === 'P2025') { // Prisma의 RecordNotFound 에러
      const error = new Error('ID를 찾을 수 없습니다.');
      error.status = 404;
      return next(error);
    }
    next(err);
  }
}


export default productRouter;git 