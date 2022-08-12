import { v4 as uuidv4 } from 'uuid';

import { UserModel } from '../models/user';
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
import { SignUpUserUsecase } from './sign-up-user';
import { InvalidEmailError } from '../../domain/errors/invalid-email';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { InvalidPasswordError } from '../../domain/errors/invalid-password';
import { UserAlreadyExistsError } from '../errors/user-already-exists';

jest.mock('uuid');

describe('SignUpUserUsecase -> execute()', () => {
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

  const signUpUserUsecase = new SignUpUserUsecase(
    mockUserRepository,
    mockArgoEncrypter,
    mockJwtAuthTokenGenerator,
  );

  it('should sign up and return fakeUserSignedDTO', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = 'Success2@22';
    const fakeAccessToken = 'any_access_token';
    const fakeRefreshToken = 'any_refresh_token';
    const fakeEncryptedPassword = 'any_encrypted_password';

    jest
      .spyOn(mockUserRepository, 'exists')
      .mockReturnValueOnce(Promise.resolve(false));

    jest
      .spyOn(mockUserRepository, 'create')
      .mockReturnValueOnce(Promise.resolve(fakeUserModel));

    jest
      .spyOn(mockArgoEncrypter, 'encrypt')
      .mockReturnValueOnce(Promise.resolve(fakeEncryptedPassword));

    jest
      .spyOn(mockJwtAuthTokenGenerator, 'generate')
      .mockReturnValueOnce(Promise.resolve(fakeAccessToken))
      .mockReturnValueOnce(Promise.resolve(fakeRefreshToken));

    const signUpOrError = await signUpUserUsecase.execute({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signUpOrError.isRight()).toBeTruthy();
    expect(signUpOrError.value).toEqual(fakeUserSigned);

    expect(mockUserRepository.exists).toHaveBeenCalledWith(fakeEmail);
    expect(mockArgoEncrypter.encrypt).toHaveBeenCalledWith(fakePassword);
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
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      id: uuidv4(),
      name: fakeName,
      email: fakeEmail,
      password: fakeEncryptedPassword,
    });

    expect(mockUserRepository.exists).toHaveBeenCalledTimes(1);
    expect(mockArgoEncrypter.encrypt).toHaveBeenCalledTimes(1);
    expect(mockJwtAuthTokenGenerator.generate).toHaveBeenCalledTimes(2);
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return InvalidEmailError if email is invalid.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'g@brie@l.hout.h@gmail.com';
    const fakePassword = 'Success2@22';

    const signUpOrError = await signUpUserUsecase.execute({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signUpOrError.isLeft()).toBeTruthy();
    expect(signUpOrError.value).toEqual(
      new InvalidEmailError(
        HttpStatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      ),
    );
  });

  it('should return InvalidPasswordError if password is invalid.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = '123';

    const signUpOrError = await signUpUserUsecase.execute({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signUpOrError.isLeft()).toBeTruthy();
    expect(signUpOrError.value).toEqual(
      new InvalidPasswordError(
        HttpStatusCode.BAD_REQUEST,
        'The password must be between 8 to 15 characters which contain at' +
          'least one lowercase letter, one uppercase letter, one numeric digit,' +
          'and one special character',
      ),
    );
  });

  it('should return UserAlreadyExistsError if user is already signed up.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = 'Success2@22';

    jest
      .spyOn(mockUserRepository, 'exists')
      .mockReturnValueOnce(Promise.resolve(true));

    const signUpOrError = await signUpUserUsecase.execute({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(signUpOrError.isLeft()).toBeTruthy();
    expect(signUpOrError.value).toEqual(
      new UserAlreadyExistsError(
        HttpStatusCode.CONFLICT,
        'This email address is already associated with another account.',
      ),
    );
    expect(mockUserRepository.exists).toHaveBeenCalledWith(fakeEmail);
    expect(mockUserRepository.exists).toHaveBeenCalledTimes(1);
  });
});
