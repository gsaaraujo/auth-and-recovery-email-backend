import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { UserModel } from '../models/user';
import { UserSignedDTO } from '../dtos/user-signed';
import { UserRegisterDTO } from '../dtos/user-register';
import { StatusCode } from '../../../../app/helpers/http';
import { IUserRepository } from '../ports/user-repository';
import { ISignUpUserUsecase } from './interfaces/sign-up-user';
import { ApiError } from '../../../../common/errors/api-error';
import { RegisterEntity } from '../../domain/entities/register';
import { Either, left, right } from '../../../../app/helpers/either';
import { UserAlreadyExistsError } from '../errors/user-already-exists';

export class SignUpUserUsecase implements ISignUpUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    name,
    email,
    password,
  }: UserRegisterDTO): Promise<Either<ApiError, UserSignedDTO>> {
    const registerEntityOrError = RegisterEntity.create(email, password);

    if (registerEntityOrError.isLeft()) {
      const error: ApiError = registerEntityOrError.value;
      return left(error);
    }

    const registerEntity: RegisterEntity = registerEntityOrError.value;
    const isAlreadySignedUp: boolean = await this.userRepository.exists(
      registerEntity.email,
    );

    if (isAlreadySignedUp) {
      const error: ApiError = new UserAlreadyExistsError(
        StatusCode.CONFLICT,
        'This email address is already associated with another account.',
      );
      return left(error);
    }

    const encryptedPassword = await bcryptjs.hash(registerEntity.password, 10);
    const userModel: UserModel = await this.userRepository.create({
      id: uuidv4(),
      name,
      email: registerEntity.email,
      password: encryptedPassword,
    });

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
