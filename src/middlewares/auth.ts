import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAppRequest } from '../types/request';
import { UnauthorizedError } from '../errors';

const parseBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: IAppRequest, res: Response, next: NextFunction) => {
  const { jwt: jwtKey } = req.cookies;

  if (!jwtKey) throw new UnauthorizedError('Необходима авторизация');

  const { JWT_SECRET = 'JWT_SECRET' } = process.env;
  const token = parseBearerToken(jwtKey);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
