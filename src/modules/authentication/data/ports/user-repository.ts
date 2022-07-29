import { UserModel } from '../models/user';
import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../common/errors/base-error';

export interface IUserRepository {
  findOneByEmail(email: string): Promise<Either<BaseError, UserModel>>;
  findOneById(id: string): Promise<Either<BaseError, UserModel>>;
}
