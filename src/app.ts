import express, { Request, Response, NextFunction }  from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { notFound } from "./controllers/not_found";

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use((req: Request, _res: Response, next: NextFunction) => {
  // @ts-expect-error 2339
  req.user = { _id: '676f4bb30f3163119a95f426' };

  next();
});
app.use(helmet());
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', notFound);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
