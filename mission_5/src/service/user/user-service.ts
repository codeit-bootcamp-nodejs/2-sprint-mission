import express from 'express';
import prisma from '../../utills/prisma';
import bcrypt from 'bcrypt';
import UserRepository from '../../repository/user/user-repository';
import ProductRepository from '../../repository/product/product-repository';
import ArticleRepository from '../../repository/article/article-repository';

class UserService {
  static getUser: express.RequestHandler = async(req, res, next) => {
    try {
      const user = await UserRepository.getUserById(req.user!.id);
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (user instanceof Error) {
        return next(user);
      }
      const { password, ...rest } = user;
      res.send(rest);
    } catch(err) {
      next(err);
    }
  }

  static updateUser: express.RequestHandler = async(req, res, next) => {
    try {
      if (req.body.password) {
        return next(new Error('비밀번호는 변경할 수 없습니다.'));
      }
      const user = await UserRepository.getUserById(req.user!.id);
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (user instanceof Error) {
        return next(user);
      }
      const updatedUser = await UserRepository.updateUser(req.user!.id, {
        email: req.body.email,
        nickname: req.body.nickname,
      });
      if (updatedUser instanceof Error) {
        return next(updatedUser);
      }
      const { password, ...rest} = updatedUser;
      res.send(rest);
    } catch(err) {
      next(err);
    }
  }

  static updatePassword: express.RequestHandler = async(req, res, next) => {
    try {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const user = await UserRepository.getUserById(req.user!.id);
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (user instanceof Error) {
        return next(user);
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return next(new Error('현재 비밀번호가 일치하지 않습니다.'));
      }
      await UserRepository.updateUser(req.user!.id, {
        password: newHashedPassword,
      });
      res.send({ message: '비밀번호 변경 성공' });
    } catch(err) {
      next(err);
    }
  }

  static getUserProducts: express.RequestHandler = async(req, res, next) => {
    try {
      const products = await ProductRepository.getUserProducts(req.user!.id);
      if (products instanceof Error) {
        return next(products);
      }
      res.send(products);
    } catch(err) {
      next(err);
    }
  }

  static getUserArticles: express.RequestHandler = async(req, res, next) => {
    try {
      const articles = await ArticleRepository.getUserArticles(req.user!.id);
      if (articles instanceof Error) {
        return next(articles);
      }
      res.send(articles);
    } catch(err) {
      next(err);
    }
  }
}

export default UserService;