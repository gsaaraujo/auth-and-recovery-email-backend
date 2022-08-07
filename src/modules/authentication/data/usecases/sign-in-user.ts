import { UserModel } from '../models/user';
import { UserSignedDTO } from '../dtos/user-signed';
import { EmailEntity } from '../../domain/entities/email';
import { IUserRepository } from '../ports/user-repository';
import { ApiError } from '../../../../app/helpers/api-error';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { UserCredentialsDTO } from '../dtos/user-credentials';
import { ISignInUserUsecase } from './interfaces/sign-in-user';
import { AuthenticationError } from '../errors/authentication';
import { Either, left, right } from '../../../../app/helpers/either';
import { IEncrypter } from '../../../../app/utils/encrypter/encrypter';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '../../../../app/helpers/env';
import { ITokenGenerator } from '../../../../app/utils/token-generator/token-generator';

export class SignInUserUsecase implements ISignInUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

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

    const isUserAuth: boolean = await this.encrypter.compare(
      userModel.password,
      password,
    );

    if (!isUserAuth) {
      const authenticationError = new AuthenticationError(
        HttpStatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      );
      return left(authenticationError);
    }

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
