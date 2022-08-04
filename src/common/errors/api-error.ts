import { debug } from 'console';
import { StatusCode } from '../../app/helpers/http';

export class ApiError extends Error {
  constructor(
    public readonly status: StatusCode,
    public readonly message: string,
  ) {
    super();
    debug(`\n-> ${this.stack}\n`);
  }
}
