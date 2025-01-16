import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAppRequest } from "../types/request";
import { NotFoundError, UnauthorizedError } from "../errors";


const parseBearerToken = (header: string) => {
  return header.replace('Bearer ', '');
};

export default (req: IAppRequest, res: Response, next: NextFunction) => {
  const { jwt: jwtKey } = req.cookies;

  if (!jwtKey) throw new UnauthorizedError('Необходима авторизация');

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new NotFoundError('Не найдена переменная окружения "JWT_SECRET"');

  const token = parseBearerToken(jwtKey);
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
