import { UserModel } from '../models/user';
import { SignInUserUsecase } from './sign-in-user';
import { UserSignedDTO } from '../dtos/user-signed';
import { IUserRepository } from '../ports/user-repository';
import { IEncrypter } from '../../../../app/utils/encrypter/encrypter';
import { IAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/auth-token-generator';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '../../../../app/helpers/env';
import { InvalidEmailError } from '../../domain/errors/invalid-email';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { AuthenticationError } from '../errors/authentication';
import { ArgoEncrypter } from '../../../../app/utils/encrypter/argo-encrypter';

describe('SignInUserUsecase -> execute()', () => {
  const fakeUserSigned: UserSignedDTO = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_access_token',
    refreshToken: 'any_refresh_token',
  };

  const fakeUserModel: UserModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
  };

  const secretAccessToken = SECRET_ACCESS_TOKEN;
  const secretRefreshToken = SECRET_REFRESH_TOKEN;
  const accessTokenExpiration = Number(ACCESS_TOKEN_EXPIRATION);
  const refreshTokenExpiration = Number(REFRESH_TOKEN_EXPIRATION);

  const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
    exists: jest.fn(),
  };

  const mockArgoEncrypter: jest.Mocked<IEncrypter> = {
    encrypt: jest.fn(),
    compare: jest.fn(),
  };
  const mockJwtAuthTokenGenerator: jest.Mocked<IAuthTokenGenerator> = {
    generate: jest.fn(),
    validate: jest.fn(),
    getPayload: jest.fn(),
  };

  const signInUserUsecase = new SignInUserUsecase(
    mockUserRepository,
    mockArgoEncrypter,
    mockJwtAuthTokenGenerator,
  );

  it('should return fakeUserSigned.', async () => {
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = 'any_password';
    const fakeAccessToken = 'any_access_token';
    const fakeRefreshToken = 'any_refresh_token';

    jest
      .spyOn(mockUserRepository, 'findOneByEmail')
      .mockReturnValueOnce(Promise.resolve(fakeUserModel));

    jest
      .spyOn(mockArgoEncrypter, 'compare')
      .mockReturnValueOnce(Promise.resolve(true));

    jest
      .spyOn(mockJwtAuthTokenGenerator, 'generate')
      .mockReturnValueOnce(Promise.resolve(fakeAccessToken))
      .mockReturnValueOnce(Promise.resolve(fakeRefreshToken));

    const signInOrError = await signInUserUsecase.execute({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signInOrError.isRight()).toBeTruthy();
    expect(signInOrError.value).toEqual(fakeUserSigned);

    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(fakeEmail);
    expect(mockArgoEncrypter.compare).toHaveBeenCalledWith(
      fakeUserModel.password,
      fakePassword,
    );
    expect(mockJwtAuthTokenGenerator.generate).toHaveBeenNthCalledWith(
      1,
      fakeUserModel.id,
      secretAccessToken,
      accessTokenExpiration,
    );
    expect(mockJwtAuthTokenGenerator.generate).toHaveBeenNthCalledWith(
      2,
      fakeUserModel.id,
      secretRefreshToken,
      refreshTokenExpiration,
    );

    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockArgoEncrypter.compare).toHaveBeenCalledTimes(1);
    expect(mockJwtAuthTokenGenerator.generate).toHaveBeenCalledTimes(2);
  });

  it('should return InvalidEmailError if email is invalid.', async () => {
    const fakeEmail = 'gab.@@gmail.c@m';
    const fakePassword = 'any_password';

    const signInOrError = await signInUserUsecase.execute({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signInOrError.isLeft()).toBeTruthy();
    expect(signInOrError.value).toEqual(
      new InvalidEmailError(
        HttpStatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      ),
    );
  });

  it('should return AuthenticationError if user is not found.', async () => {
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = 'any_password';

    jest
      .spyOn(mockUserRepository, 'findOneByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const signInOrError = await signInUserUsecase.execute({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signInOrError.isLeft()).toBeTruthy();
    expect(signInOrError.value).toEqual(
      new AuthenticationError(
        HttpStatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      ),
    );
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(fakeEmail);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockArgoEncrypter.compare).toHaveBeenCalledTimes(0);
  });

  it('should return AuthenticationError if password does not match.', async () => {
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = 'any_password';

    jest
      .spyOn(mockUserRepository, 'findOneByEmail')
      .mockReturnValueOnce(Promise.resolve(fakeUserModel));

    jest
      .spyOn(mockArgoEncrypter, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    const signInOrError = await signInUserUsecase.execute({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signInOrError.isLeft()).toBeTruthy();
    expect(signInOrError.value).toEqual(
      new AuthenticationError(
        HttpStatusCode.UNAUTHORIZED,
        'Email or password is incorrect.',
      ),
    );
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(fakeEmail);
    expect(mockArgoEncrypter.compare).toHaveBeenCalledWith(
      fakeUserModel.password,
      fakePassword,
    );

    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockArgoEncrypter.compare).toHaveBeenCalledTimes(1);
  });
});
