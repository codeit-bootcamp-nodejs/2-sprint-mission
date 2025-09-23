import express from 'express';
import { assert, StructError } from 'superstruct';
import { PrismaClient } from '@prisma/client';
import { 
  CreateProduct,
  PatchProduct,
} from '../structs.js';

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route('')
  .get(async (req, res, next) => {
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
      },
    });
      if (product.length === 0) {
        return res.send({ message : `${search}로 검색된 게시글이 없습니다. (offset: ${offset})`});
      }
    res.send(product);
  })
  .post(async (req, res, next) => {
    try {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({
        data: req.body,
      });
      res.send(product);
    } catch (err) {
      if (err instanceof StructError) {
        console.log('****************************StructError 발생!****************************');
        return next(err);
      }
      next(err);
    }
  });

productRouter.route('/:id')
  .get(async (req, res, next) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
      id: true,
      name: true, 
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      updatedAt: false,
      },
    });
    if (!product) {
      const err = new Error('ID를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    res.send(product);
  })
  .patch(async (req, res, next) =>{
    try {
      assert(req.body, PatchProduct);
      const { id } = req.params;
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      if (!product) {
      const err = new Error('ID를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
      }
      res.send(product);
    } catch (err) {
      if (err instanceof StructError) {
        console.log('****************************StructError 발생!****************************');
        return next(err);
      }
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
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
  });


export default productRouter;