import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { UserSignedDTO } from '../dtos/user-signed';
import { IUserRepository } from '../ports/user-repository';
import { UserRegisterDTO } from '../dtos/user-register';
import { ISignUpUserUsecase } from './interfaces/sign-up-user';
import { ApiError } from '../../../../common/errors/api-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { RegisterEntity } from '../../domain/entities/register';
import { UserModel } from '../models/user';

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
    const encryptedPassword = await bcryptjs.hash(registerEntity.password, 10);

    const userModelOrError = await this.userRepository.create({
      id: uuidv4(),
      name,
      email: registerEntity.email,
      password: encryptedPassword,
    });

    if (userModelOrError.isLeft()) {
      const error: ApiError = userModelOrError.value;
      return left(error);
    }

    const userModel: UserModel = userModelOrError.value;

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
