import createError from 'http-errors';
import cors from 'cors';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import actuator from 'express-actuator';
import router from './routes';
import auth from 'express-openid-connect';
import passport from './lib/middlewares/passport/index';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
// import cookieParser from 'cookie-parser';

const app = express();
app.use(morgan('dev'));
// app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.use(actuator()); 
app.use(helmet());
// https://github.com/rcruzper/express-actuator/tree/master
app.use(passport.initialize());
app.use(router);

app.use(((_req, _res, next) => {
    next(createError(404));
}) as RequestHandler);

app.use(((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer Error', code: err.code });
    }
    if (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
}) as ErrorRequestHandler);

// app.use(((err, req, res, next) => {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.status(err.status || 500).send('ERROR: ' + err.message);
// }) as ErrorRequestHandler);

export default app;