import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { IAppRequest } from '../types/request';
import {
  BadRequestError, ForbiddenError, NotFoundError, StatusCodes,
} from '../errors/index';

const NotFoundErrorMassage = 'Передан несуществующий id карточки.';
const BadRequestErrorMassage = 'Переданы некорректные данные для лайка или некорректный id карточки.';

export const getCards = (_req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: IAppRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(StatusCodes.CREATED).send({ data: card }))
    .catch(next);
};

export const deleteCardById = (req: IAppRequest, res: Response, next: NextFunction) => {
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(NotFoundErrorMassage))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Вы пытаетесь удалить чужую карточку');
      }
    })
    .then(() => {
      Card.deleteOne({ _id: req.params.cardId })
        .then((card) => {
          if (card.deletedCount === 0) {
            throw new NotFoundError('Карточка с указанным id не найдена.');
          } else {
            res.send({ message: 'Пост уже удалён' });
          }
        });
    })
    .catch((error) => {
      const errorToThrow = error.name === 'CastError'
        ? new BadRequestError('Передан некорректный id карточки.')
        : error;

      next(errorToThrow);
    });
};

export const likeCard = (req: IAppRequest, res: Response, next: NextFunction) => {
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(NotFoundErrorMassage))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      const errorToThrow = error.name === 'CastError'
        ? new BadRequestError(BadRequestErrorMassage)
        : error;

      next(errorToThrow);
    });
};

export const dislikeCard = (req: IAppRequest, res: Response, next: NextFunction) => {
  const requestUser = req.user;
  // eslint-disable-next-line no-underscore-dangle
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(NotFoundErrorMassage))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      const errorToThrow = error.name === 'CastError'
        ? new BadRequestError(BadRequestErrorMassage)
        : error;

      next(errorToThrow);
    });
};
