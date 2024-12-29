import { Request, Response } from 'express';


const NOT_FOUND_CODE = 404;
const NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый ресурс не найден';

export const notFound = (_req: Request, res: Response) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ERROR_MESSAGE });
};
