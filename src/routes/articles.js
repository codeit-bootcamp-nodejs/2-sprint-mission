const express = require('express');
const router = express.Router();

const {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
} = require('../controllers/article.controller');

// 게시글 목록, 등록
router.route('/')
  .get(getArticles)       
  .post(createArticle);   

// 게시글 조회, 수정, 삭제 
router.route('/:id')
  .get(getArticleById)    
  .patch(updateArticle)   
  .delete(deleteArticle); 

module.exports = router;