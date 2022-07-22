import { Either } from 'fp-ts/lib/Either';
import { UserCredentialsDTO } from '../usecases/sign-in';
import { BaseError } from '../../../../core/errors/base-error';

export interface IAuthRepository {
  signIn(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserCredentialsDTO>>;
}
