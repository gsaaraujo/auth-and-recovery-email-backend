import { Either, left, right } from 'fp-ts/Either';
import { IAuthRepository } from '../repositories/sign-in';
import { BaseError } from '../../../../core/errors/base-error';

export type UserCredentialsDTO = {
  uid: string;
  name: string;
  email: string;
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
