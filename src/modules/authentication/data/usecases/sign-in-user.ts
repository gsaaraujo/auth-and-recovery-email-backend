import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { UserModel } from '../models/user';
import { UserSignedDTO } from '../dtos/user-signed';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { EmailEntity } from '../../domain/entities/email';
import { IUserRepository } from '../ports/user-repository';
import { UserCredentialsDTO } from '../dtos/user-credentials';
import { ISignInUserUsecase } from './interfaces/sign-in-user';
import { ApiError } from '../../../../app/helpers/api-error';
import { AuthenticationError } from '../errors/authentication';
import { Either, left, right } from '../../../../app/helpers/either';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '../../../../app/helpers/env';

export class SignInUserUsecase implements ISignInUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: UserCredentialsDTO): Promise<Either<ApiError, UserSignedDTO>> {
    const emailEntityOrError = EmailEntity.create(email);

    if (emailEntityOrError.isLeft()) {
      const error: ApiError = emailEntityOrError.value;
      return left(error);
    }

    const emailEntity: EmailEntity = emailEntityOrError.value;

    const userModel: UserModel | null =
      await this.userRepository.findOneByEmail(emailEntity.email);

    if (!userModel) {
      const authenticationError = new AuthenticationError(
        HttpStatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      );
      return left(authenticationError);
    }

    const isUserAuth: boolean = await bcryptjs.compare(
      password,
      userModel.password,
    );

    if (!isUserAuth) {
      const authenticationError = new AuthenticationError(
        HttpStatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      );
      return left(authenticationError);
    }

    const accessToken: string = jwt.sign(
      { userId: userModel.id },
      SECRET_ACCESS_TOKEN,
      { expiresIn: ACCESS_TOKEN_EXPIRATION },
    );

    const refreshToken: string = jwt.sign(
      { userId: userModel.id },
      SECRET_REFRESH_TOKEN,
      { expiresIn: REFRESH_TOKEN_EXPIRATION },
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
