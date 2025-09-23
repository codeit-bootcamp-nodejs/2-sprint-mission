import express from 'express';
import prisma from '../../utills/prisma';
import ProductLikedRepository from '../../repository/product/product-liked-repository';
class ProductLikedService {

  static getProductLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const productLiked = await ProductLikedRepository.getProductLiked(Number(req.user!.id));
      res.send(productLiked);
    } catch(err) {
      next(err);
    } 
  }

  static createProductLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const productLiked = await ProductLikedRepository.getProductLikedById(Number(req.user!.id), Number(req.params.productId));
      if (productLiked) {
        return next(new Error('이미 좋아요를 눌렀습니다.'));
      }
      await ProductLikedRepository.createProductLiked(Number(req.user!.id), Number(req.params.productId));
      res.send({ message: '좋아요를 눌렀습니다.' });
    } catch (err) {
      next(err);
    }
  }

  static deleteProductLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const productLiked = await ProductLikedRepository.getProductLikedById(Number(req.user!.id), Number(req.params.productId));
      if (!productLiked) {
        return next(new Error('좋아요를 찾을 수 없습니다.'));
      }
      await ProductLikedRepository.deleteProductLiked(Number(req.user!.id), Number(req.params.productId));
      res.send({ message: '좋아요를 취소했습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

export default ProductLikedService;