import { Router } from 'express';
import { getCards, deleteCardById, createCard, likeCard, dislikeCard } from '../controllers/cards'

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;