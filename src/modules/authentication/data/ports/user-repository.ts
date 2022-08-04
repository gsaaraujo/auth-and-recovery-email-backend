import { UserModel } from '../models/user';
import { Either } from '../../../../app/helpers/either';
import { ApiError } from '../../../../common/errors/api-error';

export interface IUserRepository {
  findOneByEmail(email: string): Promise<Either<ApiError, UserModel | null>>;
  create(user: UserModel): Promise<Either<ApiError, UserModel>>;
}
