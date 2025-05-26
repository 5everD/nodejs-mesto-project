import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { errors } from 'celebrate';
import { connect } from 'mongoose';
import 'dotenv/config';
import auth from './middlewares/auth';
import rateLimit from './middlewares/rate-limit';
import errorHandling from './middlewares/errors-handling';
import { requestLogger, errorLogger } from './middlewares/logger';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import notFound from './controllers/not_found';
import { createUser, loginUser } from './controllers/users';
import { userSignInValidate, userSignUpValidate } from './utils/data-validate';

const { PORT = 3000 } = process.env;

const app = express();

connect('mongodb://localhost:27017/mestodb');

app.use(cors());
app.use(rateLimit);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', userSignInValidate, loginUser);
app.post('/signup', userSignUpValidate, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', notFound);

app.use(errorLogger);
app.use(errors());
app.use(errorHandling);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
