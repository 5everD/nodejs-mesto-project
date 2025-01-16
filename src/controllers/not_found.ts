import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors';

const NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый ресурс не найден';

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
};

export default notFound;
