import { UserSignedEntity } from '../entities/user-signed';
import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';

export interface ISignInUsecase {
  execute(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserSignedEntity>>;
}
