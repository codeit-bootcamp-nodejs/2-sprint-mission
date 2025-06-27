const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const passport = require('passport');

const authRoutes = require('./src/routes/auth.route');
const mypageRoutes = require('./src/routes/mypage.route');
const productRoutes = require('./src/routes/product.route');
const articleRoutes = require('./src/routes/article.route');
const commentRoutes = require('./src/routes/comment.route');
const errorHandler = require('./src/middlewares/error.middleware');

const { PORT } = require('./src/lib/constants');
const cookieParser = require('cookie-parser');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // passport 초기화

// 라우터 연결
app.use('/auth', authRoutes);
app.use('/mypage', mypageRoutes);
app.use('/product', productRoutes);
app.use('/article', articleRoutes);
app.use('/', commentRoutes);

// 파일 정적 서빙

const multer = require('multer');

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


app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});

module.exports = app;

