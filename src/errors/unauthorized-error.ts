import StatusCodes from './status-codes';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Передан неверный логин или пароль') {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
