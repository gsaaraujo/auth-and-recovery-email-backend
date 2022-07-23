import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { IAuthRepository } from '../repositories/sign-in';
import { BaseError } from '../../../../core/errors/base-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { InvalidCredentialsError } from '../../adapters/errors/invalid-credentials';

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

    const isUserAuth: boolean = bcryptjs.compareSync(
      password,
      userOrError.value.password,
    );

    if (!isUserAuth) {
      return left(
        new InvalidCredentialsError({
          message: 'Email or password is incorrect.',
        }),
      );
    }

    const accessToken: string = jwt.sign(
      userOrError.value.uid,
      process.env.SECRET_ACCESS_TOKEN ?? 'ced7cafb-ca79-4b39-b154-b99afaed33b7',
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m',
      },
    );

    const userCredentials: UserCredentialsDTO = {
      uid: userOrError.value.uid,
      name: userOrError.value.name,
      email: userOrError.value.email,
      accessToken: accessToken,
      refreshToken: '',
    };

    return right(userCredentials);
  }
}
