import { debug } from 'console';

type BaseErrorType = {
  message: string;
};

export class BaseError extends Error {
  constructor({ message }: BaseErrorType) {
    super();

    debug(`--> ${message} <--`);
    Error.captureStackTrace(this);
  }
}
