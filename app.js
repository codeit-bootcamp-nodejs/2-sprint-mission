const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('./routes/product');
const { getAllArticles, createArticle, getArticleById, updateArticle, deleteArticle } = require('./routes/article');
const {
    getAllProductComments,
    getAllArticleComments,
    createProductComment,
    createArticleComment,
    updateProductComment,
    updateArticleComment,
    deleteProductComment,
    deleteArticleComment,
} = require('./routes/comment');
const errorHandler = require('./error/errorHendler');

const app = express();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: 'uploads/' });

// 미들웨어
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Render!');
});

// 라우터
app.route('/product').get(getAllProducts).post(createProduct);

app.route('/product/:id').get(getProductById).patch(upload.single('file'), updateProduct).delete(deleteProduct);

app.route('/article').get(getAllArticles).post(createArticle);

app.route('/article/:id').get(getArticleById).patch(updateArticle).delete(deleteArticle);

app.route('/product/:productId/comment').get(getAllProductComments).post(createProductComment);

app.route('/product/:productId/comment/:commentId').patch(updateProductComment).delete(deleteProductComment);

app.route('/article/:articleId/comment').get(getAllArticleComments).post(createArticleComment);

app.route('/article/:articleId/comment/:commentId').patch(updateArticleComment).delete(deleteArticleComment);

// localhost:3000/products/files/파일이름 으로 요청하면 uploads/파일이름 파일을 정적으로 서빙
app.use('/product/files', express.static('uploads'));

// 에러 핸들러
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});
