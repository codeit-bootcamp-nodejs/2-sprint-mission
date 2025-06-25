const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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

// ../uploads 폴더를 경로에 만들고, 해당 폴더가 없으면 새로 생성하는 코드 -> 업로드된 파일이 저장될 물리적 폴더 준비
// 이 코드가 없으면 서버가 처음 실행될 때 uploads/ 폴더가 없다면 업로드 실패할 수 있다. (초기 실행시 중요)
// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);  // 실질적으로 여기에서 필요한 코드 아님

// multer는 파일 업로드를 처리해주는 미들웨어
// upload.single('file')에서 사용하는 upload 객체를 만들기 위한 설정
// dest는 실제 업로드 파일이 저장될 폴더 경로(uploads/)를 지정하는 것 -> 이 코드가 있어야 파일이 업로드되고 저장될 수 있다.
const upload = multer({ dest: 'uploads/' });

// 미들웨어
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Render!');
});

// 라우터
// 메서드 안에 작성된 변수들은 각 메서드 요청이 들어왔을 때 실행되는 함수들(handler)
app.route('/product').get(getAllProducts).post(createProduct);

// 클라이언트에서 form-data로 파일을 업로드 할 경우, 해당 파일을 서버에서 받아서 처리해주려면 upload.single('file') 미들웨어가 필요하다.
// 'file'은 클라이언트에서 보낼 때 input 태그나 form 필드 이름이 'file'일 경우에 매칭된다.
// 이 미들웨어가 없으면 req.file은 존재하지 않고, 파일도 저장되지 않는다.
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
