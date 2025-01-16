import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import type { IAppRequest } from '../types/request';
import {
  BadRequestError, NotFoundError, UnauthorizedError, StatusCodes,
} from '../errors';

const NotFoundErrorMassage = 'Пользователь с указанномым id не найден.';

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) throw new UnauthorizedError();
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) throw new UnauthorizedError();

      return user;
    })
    .then((user) => {
      const { JWT_SECRET = 'JWT_SECRET' } = process.env;
      // eslint-disable-next-line no-underscore-dangle
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 60 * 60 * 1000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'ok' });
    })
    .catch(next);
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUser = (req: IAppRequest, res: Response, next: NextFunction) => {
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(NotFoundErrorMassage))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      const errorToThrow = error.name === 'CastError'
        ? new BadRequestError('Передан некорректный id пользователя.')
        : error;

      next(errorToThrow);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(StatusCodes.CREATED).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          // eslint-disable-next-line no-underscore-dangle
          _id: user._id,
        },
      })))
    .catch(next);
};

export const updateUser = (req: IAppRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(NotFoundErrorMassage))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      const errorToThrow = error.name === 'CastError'
        ? new BadRequestError('Переданы некорректные данные при обновлении пользователя.')
        : error;

      next(errorToThrow);
    });
};

export const updateAvatar = (req: IAppRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(NotFoundErrorMassage))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      const errorToThrow = error.name === 'CastError'
        ? new BadRequestError('Переданы некорректные данные при обновлении аватара.')
        : error;

      next(errorToThrow);
    });
};
