import { Either, left, right } from 'fp-ts/Either';
import { BaseError } from '../../../../core/errors/base-error';
import { IAuthRepository } from '../repositories/sign-in';

export type UserCredentialsDTO = {
  uid: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

interface ISignInUsecase {
  execute(
    email: string,
    password: string,
  ): Promise<Either<Error, UserCredentialsDTO>>;
}

class SignInUsecaseImpl implements ISignInUsecase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserCredentialsDTO>> {
    return this.authRepository.signIn(email, password);
  }
}
