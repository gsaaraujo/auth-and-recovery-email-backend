import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { UserModel } from '../models/user';
import { UserSignedDTO } from '../dtos/user-signed';
import { IUserRepository } from '../ports/user-repository';
import { UserCredentialsDTO } from '../dtos/user-credentials';
import { ISignInUserUsecase } from './interfaces/sign-in-user';
import { ApiError } from '../../../../common/errors/api-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { UserNotAuthenticatedError } from '../errors/user-not-authenticated';
import { UserCredentialsEntity } from '../../domain/entities/user-credentials';
import { StatusCode } from '../../../../app/helpers/http';

export class SignInUserUsecase implements ISignInUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: UserCredentialsDTO): Promise<Either<ApiError, UserSignedDTO>> {
    const userCredentialsEntityOrError = UserCredentialsEntity.create(
      email,
      password,
    );

    if (userCredentialsEntityOrError.isLeft()) {
      const error: ApiError = userCredentialsEntityOrError.value;
      return left(error);
    }

    const userCredentialsEntity: UserCredentialsEntity =
      userCredentialsEntityOrError.value;

    const userModelOrError = await this.userRepository.findOneByEmail(
      userCredentialsEntity.email,
    );

    if (userModelOrError.isLeft()) {
      const error: ApiError = userModelOrError.value;
      return left(error);
    }

    const userModel: UserModel | null = userModelOrError.value;

    if (!userModel) {
      const notAuthorizedError = new UserNotAuthenticatedError(
        StatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      );
      return left(notAuthorizedError);
    }

    const isUserAuth: boolean = await bcryptjs.compare(
      userCredentialsEntity.password,
      userModel.password,
    );

    if (!isUserAuth) {
      const notAuthorizedError = new UserNotAuthenticatedError(
        StatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      );
      return left(notAuthorizedError);
    }

    const accessToken: string = jwt.sign(
      { userId: userModel.id },
      process.env.SECRET_ACCESS_TOKEN ?? '',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m' },
    );

    const refreshToken: string = jwt.sign(
      { userId: userModel.id },
      process.env.SECRET_REFRESH_TOKEN ?? '',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d' },
    );

    const userSignedDTO: UserSignedDTO = {
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      accessToken,
      refreshToken,
    };

    return right(userSignedDTO);
  }
}
