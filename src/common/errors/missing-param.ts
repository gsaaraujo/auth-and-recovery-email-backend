import { ApiError } from './api-error';

export class MissingParamError extends ApiError {
  constructor(paramName: string) {
    super(`The ${paramName} must not be empty.`);
  }
}
