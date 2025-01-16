import type { JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';

export interface IAppRequest extends Request {
  user?: JwtPayload | string;
}
