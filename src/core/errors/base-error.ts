import { debug } from 'console';

type BaseErrorType = {
  message: string;
};

export class BaseError extends Error {
  constructor({ message }: BaseErrorType) {
    debug(`--> ${message} <--`);
    super();
  }
}
