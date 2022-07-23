import { Either, left } from '../../../../app/helpers/either';
import { IAuthRepository } from '../repositories/sign-in';
import { BaseError } from '../../../../core/errors/base-error';

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
    const userOrError = await this.authRepository.signIn(email, password);

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }
  }
}
