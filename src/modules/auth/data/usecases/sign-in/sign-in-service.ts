import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { ISignInUsecase } from './sign-in';
import { UserSignedDTO } from '../../dtos/user-signed';
import { UserCredentialsDTO } from '../../dtos/user-credentials';
import { BaseError } from '../../../../../core/errors/base-error';
import { IAuthRepository, UserDTO } from '../../ports/auth-repository';
import { Either, left, right } from '../../../../../app/helpers/either';
import { InvalidCredentialsError } from '../../errors/invalid-credentials';

class SignInService implements ISignInUsecase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute({
    email,
    password,
  }: UserCredentialsDTO): Promise<Either<BaseError, UserSignedDTO>> {
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

    const userCredentials: UserSignedDTO = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return right(userCredentials);
  }
}
