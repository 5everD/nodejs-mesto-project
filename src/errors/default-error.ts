import StatusCodes from './status-codes';

class DefaultError extends Error {
  statusCode: number;

  constructor(message: string = 'На сервере произошла ошибка, попробуйте позже.') {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default DefaultError;
