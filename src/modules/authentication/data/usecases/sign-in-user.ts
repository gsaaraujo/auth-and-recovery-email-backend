import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { UserModel } from '../models/user';
import { IUserRepository } from '../ports/user-repository';
import { ISignInUserUsecase } from './interfaces/sign-in-user';
import { BaseError } from '../../../../common/errors/base-error';
import { UserSignedEntity } from '../../domain/entities/user-signed';
import { Either, left, right } from '../../../../app/helpers/either';
import { UserNotAuthenticatedError } from '../errors/user-not-authenticated';
import { UserCredentialsEntity } from '../../domain/entities/user-credentials';

export class SignInUserUsecase implements ISignInUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserSignedEntity>> {
    const userCredentialsEntityOrError = UserCredentialsEntity.create(
      email,
      password,
    );

    if (userCredentialsEntityOrError.isLeft()) {
      const error: BaseError = userCredentialsEntityOrError.value;
      return left(error);
    }

    const userCredentialsEntity: UserCredentialsEntity =
      userCredentialsEntityOrError.value;

    const userModelOrError = await this.userRepository.findOneByEmail(
      userCredentialsEntity.email,
    );

    if (userModelOrError.isLeft()) {
      const error: BaseError = userModelOrError.value;
      return left(error);
    }

    const userModel: UserModel = userModelOrError.value;
    // const isUserAuth: boolean = await bcryptjs.compare(
    //   userCredentialsEntity.password,
    //   userModel.password,
    // );

    // if (!isUserAuth) {
    //   return left(
    //     new UserNotAuthenticatedError('Email or password is incorrect.'),
    //   );
    // }

    const accessToken: string = jwt.sign(
      { userId: userModel.uid },
      process.env.SECRET_ACCESS_TOKEN ?? '',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m' },
    );

    const refreshToken: string = jwt.sign(
      { userId: userModel.uid },
      process.env.SECRET_REFRESH_TOKEN ?? '',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d' },
    );

    const userSignedEntity = new UserSignedEntity(
      userModel.uid,
      userModel.name,
      userModel.email,
      accessToken,
      refreshToken,
    );

    return right(userSignedEntity);
  }
}
