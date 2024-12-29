import { Request, Response } from 'express';
import Card from '../models/card';

const DATA_ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const DEFAULT_ERROR_CODE = 500;
const ID_ERROR_MESSAGE = 'передан некорректный _id';
const DATA_ERROR_MESSAGE = 'переданы некорректные данные';
const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка';


export const getCards = (_req: Request, res: Response) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
// @ts-expect-error 2339
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send({ data: card }))
    .catch(() => res.status(DATA_ERROR_CODE).send({ message: DATA_ERROR_MESSAGE }));
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(() => res.status(NOT_FOUND_CODE).send({ message: ID_ERROR_MESSAGE }));
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-expect-error 2339
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then(card => res.send({ data: card }))
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

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-expect-error 2339
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then(card => res.send({ data: card }))
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