import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const requestTransport = new winston.transports.DailyRotateFile({
  dirname: './logs/',
  filename: 'request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '7d',
});

const errorTransport = new winston.transports.DailyRotateFile({
  dirname: './logs/',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '7d',
});

export const requestLogger = expressWinston.logger({
  transports: [
    requestTransport,
    new winston.transports.File({ filename: './logs/request.log' }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    errorTransport,
    new winston.transports.File({ filename: './logs/error.log' }),
  ],
  format: winston.format.json(),
});
