import { debug } from 'console';
import { HttpStatusCode } from './http';

export class ApiError extends Error {
  constructor(
    public readonly status: HttpStatusCode,
    public readonly message: string,
  ) {
    super();
    debug(`\n-> ${this.stack}\n`);
  }
}
