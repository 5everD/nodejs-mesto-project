import { Request, Response } from 'express';
import User from '../models/user';

const DATA_ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const DEFAULT_ERROR_CODE = 500;
const ID_ERROR_MESSAGE = 'передан некорректный _id';
const DATA_ERROR_MESSAGE = 'переданы некорректные данные';
const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка';

export const getUsers = (_req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE }));
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_CODE).send({ message: ID_ERROR_MESSAGE })
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE })
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar})
    .then((user) => res.status(201).send({ data: user }))
    .catch(() => res.status(DATA_ERROR_CODE).send({ message: DATA_ERROR_MESSAGE }));
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    // @ts-expect-error 2339
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(DATA_ERROR_CODE).send({ message: DATA_ERROR_MESSAGE })
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_CODE).send({ message: ID_ERROR_MESSAGE })
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE})
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    // @ts-expect-error 2339
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(DATA_ERROR_CODE).send({ message: DATA_ERROR_MESSAGE })
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_CODE).send({ message: ID_ERROR_MESSAGE })
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE})
    });
};
