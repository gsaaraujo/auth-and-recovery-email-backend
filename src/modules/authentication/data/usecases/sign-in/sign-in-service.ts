import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { UserDTO } from '../../dtos/user';
import { ISignInUsecase } from './sign-in';
import { UserSignedDTO } from '../../dtos/user-signed';
import { IUserRepository } from '../../ports/user-repository';
import { BaseError } from '../../../../../core/errors/base-error';
import { Either, left, right } from '../../../../../app/helpers/either';
import { UserNotAuthenticated } from '../../errors/user-not-authenticated';

export class SignInService implements ISignInUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserSignedDTO>> {
    const userOrError = await this.userRepository.findOneByEmail(email);

    if (userOrError.isLeft()) {
      const error: BaseError = userOrError.value;
      return left(error);
    }

    const user: UserDTO = userOrError.value;
    const isUserAuth: boolean = await bcryptjs.compare(password, user.password);

    if (!isUserAuth) {
      return left(new UserNotAuthenticated('Email or password is incorrect.'));
    }

    const accessToken: string = jwt.sign(
      { userId: user.uid },
      process.env.SECRET_ACCESS_TOKEN ?? 'ced7cafb-ca79-4b39-b154-b99afaed33b7',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m' },
    );

    const refreshToken: string = jwt.sign(
      { userId: user.uid },
      process.env.SECRET_REFRESH_TOKEN ??
        '78c24895-5fe3-4eb6-8266-6f2726be4f7d',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d' },
    );

    const userSigned: UserSignedDTO = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return right(userSigned);
  }
}
