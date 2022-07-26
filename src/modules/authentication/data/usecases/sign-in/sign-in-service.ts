import jwt from 'jsonwebtoken';
import s from 'bcryptjs';

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
    // const isUserAuth: boolean = await bcryptjs.compare(password, user.password);

    // if (!isUserAuth) {
    //   return left(new UserNotAuthenticated('Email or password is incorrect.'));
    // }

    const accessToken: string = jwt.sign(
      { userId: user.uid },
      process.env.SECRET_ACCESS_TOKEN ?? '',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m' },
    );

    const refreshToken: string = jwt.sign(
      { userId: user.uid },
      process.env.SECRET_REFRESH_TOKEN ?? '',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d' },
    );

    const userSigned = new UserSignedDTO(
      user.uid,
      user.name,
      user.email,
      accessToken,
      refreshToken,
    );

    return right(userSigned);
  }
}
