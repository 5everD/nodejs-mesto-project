import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { DefaultError, ConflictError, BadRequestError } from '../errors/index';

const generateValidationTextError = (errors: Record<string, Error.ValidatorError>): string => {
  let errorMessage = '';

  Object.keys(errors).forEach((errorKey) => {
    const errorValue = errors[errorKey];

    if (errorValue?.properties?.message) {
      errorMessage += errorValue.properties.message;
    }
  });

  return errorMessage;
};

const errorHandling = (
  error: Error & {
    statusCode: number;
    code?: number;
    errors: Record<string, Error.ValidatorError>;
  },
  _request: Request,
  response: Response,
) => {
  let normalizedError = error.statusCode ? error : new DefaultError();

  if (error?.code === 11000) {
    normalizedError = new ConflictError(
      'При регистрации указан email, который уже существует на сервере',
    );
  } else if (error.name === 'ValidationError') {
    normalizedError = new BadRequestError(
      `Переданы некорректные данные ${error.errors
        ? `: ${generateValidationTextError(error.errors)}`
        : '.'}`,
    );
  }

  response.status(normalizedError.statusCode).send({ message: normalizedError.message });
};

export default errorHandling;
