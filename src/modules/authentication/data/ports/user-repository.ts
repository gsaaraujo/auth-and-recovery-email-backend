import { UserModel } from '../models/user';
import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';

export interface IUserRepository {
  findOneByEmail(email: string): Promise<Either<BaseError, UserModel>>;
}
