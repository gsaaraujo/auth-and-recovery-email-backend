import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { BaseError } from '../../../../core/errors/base-error';
import { IAuthRepository, UserDTO } from '../repositories/sign-in';
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
      const error: BaseError = userOrError.value;
      return left(error);
    }

    const user: UserDTO = userOrError.value;
    const isUserAuth: boolean = bcryptjs.compareSync(password, user.password);

    if (!isUserAuth) {
      return left(
        new InvalidCredentialsError({
          message: 'Email or password is incorrect.',
        }),
      );
    }

    const accessToken: string = jwt.sign(
      user.uid,
      process.env.SECRET_ACCESS_TOKEN ?? 'ced7cafb-ca79-4b39-b154-b99afaed33b7',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m' },
    );

    const refreshToken: string = jwt.sign(
      user.uid,
      process.env.SECRET_REFRESH_TOKEN ??
        '78c24895-5fe3-4eb6-8266-6f2726be4f7d',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d' },
    );

    const userCredentials: UserCredentialsDTO = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return right(userCredentials);
  }
}
