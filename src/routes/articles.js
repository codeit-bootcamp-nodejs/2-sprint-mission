const express = require('express');
const router = express.Router();

const {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
} = require('../controllers/article.controller');

router.route('/')
  .get(getArticles)       
  .post(createArticle);   

router.route('/:id')
  .get(getArticleById)    
  .patch(updateArticle)   
  .delete(deleteArticle); 

module.exports = router;