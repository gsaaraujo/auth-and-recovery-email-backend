import { v4 as uuidv4 } from 'uuid';

import { UserModel } from '../models/user';
import { UserSignedDTO } from '../dtos/user-signed';
import { UserRegisterDTO } from '../dtos/user-register';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { IUserRepository } from '../ports/user-repository';
import { ISignUpUserUsecase } from './interfaces/sign-up-user';
import { ApiError } from '../../../../app/helpers/api-error';
import { RegisterEntity } from '../../domain/entities/register';
import { Either, left, right } from '../../../../app/helpers/either';
import { UserAlreadyExistsError } from '../errors/user-already-exists';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '../../../../app/helpers/env';
import { IEncrypter } from '../../../../app/utils/encrypter/encrypter';
import { ITokenGenerator } from '../../../../app/utils/token-generator/token-generator';

export class SignUpUserUsecase implements ISignUpUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

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
        HttpStatusCode.CONFLICT,
        'This email address is already associated with another account.',
      );
      return left(error);
    }

    const encryptedPassword = await this.encrypter.encrypt(
      registerEntity.password,
    );
    const userModel: UserModel = await this.userRepository.create({
      id: uuidv4(),
      name,
      email: registerEntity.email,
      password: encryptedPassword,
    });

    const accessToken: string = await this.tokenGenerator.generate(
      SECRET_ACCESS_TOKEN,
      Number(ACCESS_TOKEN_EXPIRATION),
      { userId: userModel.id },
    );

    const refreshToken: string = await this.tokenGenerator.generate(
      SECRET_REFRESH_TOKEN,
      Number(REFRESH_TOKEN_EXPIRATION),
      { userId: userModel.id },
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
