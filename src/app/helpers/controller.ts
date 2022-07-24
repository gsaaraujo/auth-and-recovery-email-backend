import { Either } from './either';
import { BaseError } from '../../core/errors/base-error';

export type HttpResponse<T> = {
  statusCode: number;
  data: T;
};

export interface Controller<I, O> {
  handle(data?: I): Promise<Either<BaseError, HttpResponse<O>>>;
}
