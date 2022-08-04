import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { UserSignedDTO } from '../dtos/user-signed';
import { IUserRepository } from '../ports/user-repository';
import { UserRegisterDTO } from '../dtos/user-register';
import { ISignUpUserUsecase } from './interfaces/sign-up-user';
import { ApiError } from '../../../../common/errors/api-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { UserRegisterEntity } from '../../domain/entities/user-register';

export class SignUpUserUsecase implements ISignUpUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    name,
    email,
    password,
  }: UserRegisterDTO): Promise<Either<ApiError, UserSignedDTO>> {
    const userRegisterEntityOrError = UserRegisterEntity.create(
      name,
      email,
      password,
    );

    if (userRegisterEntityOrError.isLeft()) {
      const error: ApiError = userRegisterEntityOrError.value;
      return left(error);
    }

    const userRegisterEntity: UserRegisterEntity =
      userRegisterEntityOrError.value;

    const encryptedPassword = await bcryptjs.hash(
      userRegisterEntity.password,
      10,
    );

    const userModelOrError = await this.userRepository.create({
      id: userRegisterEntity.id,
      name: userRegisterEntity.name,
      email: userRegisterEntity.email,
      password: encryptedPassword,
    });

    if (userModelOrError.isLeft()) {
      const error: ApiError = userModelOrError.value;
      return left(error);
    }

    const userModel = userModelOrError.value;

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

    const userSigned: UserSignedDTO = {
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      accessToken,
      refreshToken,
    };

    return right(userSigned);
  }
}
