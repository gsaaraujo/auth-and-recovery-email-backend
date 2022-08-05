import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { UserModel } from '../models/user';
import { UserSignedDTO } from '../dtos/user-signed';
import { IUserRepository } from '../ports/user-repository';
import { UserCredentialsDTO } from '../dtos/user-credentials';
import { ISignInUserUsecase } from './interfaces/sign-in-user';
import { ApiError } from '../../../../common/errors/api-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { NotAuthenticatedError } from '../errors/not-authenticated';
import { StatusCode } from '../../../../app/helpers/http';
import { EmailEntity } from '../../domain/entities/email';

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

    const userModelOrError = await this.userRepository.findOneByEmail(
      emailEntity.email,
    );

    if (userModelOrError.isLeft()) {
      const error: ApiError = userModelOrError.value;
      return left(error);
    }

    const userModel: UserModel | null = userModelOrError.value;

    if (!userModel) {
      const notAuthorizedError = new NotAuthenticatedError(
        StatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      );
      return left(notAuthorizedError);
    }

    const isUserAuth: boolean = await bcryptjs.compare(
      password,
      userModel.password,
    );

    if (!isUserAuth) {
      const notAuthorizedError = new NotAuthenticatedError(
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
