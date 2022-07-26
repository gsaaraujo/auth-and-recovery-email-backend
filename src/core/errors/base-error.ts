import { debug } from 'console';

export class BaseError extends Error {
  constructor(public readonly message: string) {
    super();

    debug(`\n[Error] ${message} \n[Stack trace]${this.stack}\n`);
  }
}
