const express = require('express');
const router = express.Router();
const passport = require('../lib/passport/index');

const mypageController = require('../controllers/mypage.controller');

const { route } = require('./auth.route');

// 내 정보 조회  
router.route('/info').get(passport.authenticate('access-token', { session: false }), mypageController.getMyInfo);

// 내 정보 수정
router.route('/info').patch(passport.authenticate('access-token', { session: false }), mypageController.updateMyInfo);

// 비밀번호 변경
router.route('/info/pw').patch(passport.authenticate('access-token', { session: false }), mypageController.updateMyPw);

// 내가 등록한 상품 목록 조회
router.route('/list/products').get(passport.authenticate('access-token', { session: false }), mypageController.getMyProducts);

// 내가 작성한 게시글 목록 조회
router.route('/list/articles').get(passport.authenticate('access-token', { session: false }), mypageController.getMyArticles);

// 내가 작성한 댓글 목록 조회
router.route('/list/comments').get(passport.authenticate('access-token', { session: false }), mypageController.getMyComments);

// 내가 좋아요 한 상품 목록 조회
router.route('/list/likedProducts').get(passport.authenticate('access-token', { session: false }), mypageController.getLikedProducts);

// 내가 좋아요 한 게시글 목록 조회
router.route('/list/likedArticles').get(passport.authenticate('access-token', { session: false }), mypageController.getLikedArticles);

export default router;
