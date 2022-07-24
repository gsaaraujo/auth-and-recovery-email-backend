import { UserDTO } from '../dtos/user';
import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';

export interface IUserRepository {
  signIn(email: string, password: string): Promise<Either<BaseError, UserDTO>>;
}
