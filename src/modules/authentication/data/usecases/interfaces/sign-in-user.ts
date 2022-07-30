import { UserSignedEntity } from '../../../domain/entities/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { BaseError } from '../../../../../common/errors/base-error';

export interface ISignInUserUsecase {
  execute(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserSignedEntity>>;
}
