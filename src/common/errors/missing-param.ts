import { BaseError } from './base-error';

export class MissingParamError extends BaseError {
  constructor(paramName: string) {
    super(`The ${paramName} must not be empty.`);
  }
}
