import { Router } from 'express';
import {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { cardIdValidate, cardValidate } from '../utils/data-validate';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidate, createCard);
cardRouter.delete('/:cardId', cardIdValidate, deleteCardById);
cardRouter.put('/:cardId/likes', cardIdValidate, likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidate, dislikeCard);

export default cardRouter;
