import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import productRouter from './routes/product.js';
import articleRouter from './routes/article.js';
import artiCommentRouter from './routes/artiComment.js';
import prodCommentRouter from './routes/prodComment.js';
import fileRouter from './routes/file.js';
import { notFoundErrorHandeler, errorHandler } from './utills/errorHandler.js'

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'https://three-sprint-mission-4goe.onrender.com'],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/product', productRouter);
app.use('/article', articleRouter);
app.use('/artiComment', artiCommentRouter);
app.use('prodComment', prodCommentRouter);
app.use('/file', fileRouter);
app.use('/file', express.static('uploads'));
app.use('', notFoundErrorHandeler);
app.use('', errorHandler)




app.listen(process.env.PORT || 3000, () => console.log('Server Started'));