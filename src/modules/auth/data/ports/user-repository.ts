import { UserDTO } from '../dtos/user';
import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';

export interface IUserRepository {
  findOneByEmail(email: string): Promise<Either<BaseError, UserDTO>>;
}
