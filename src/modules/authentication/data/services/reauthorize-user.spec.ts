import {
  ACCESS_TOKEN_EXPIRATION,
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '../../../../app/helpers/env';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { IAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/auth-token-generator';
import { AuthenticationError } from '../errors/authentication';
import { ReauthorizeUserService } from './reauthorize-user';

describe('Reauthorize-user -> execute()', () => {
  const mockAuthTokenGenerator: jest.Mocked<IAuthTokenGenerator> = {
    generate: jest.fn(),
    validate: jest.fn(),
    getPayload: jest.fn(),
  };

  const secretAccessToken = SECRET_ACCESS_TOKEN;
  const secretRefreshToken = SECRET_REFRESH_TOKEN;
  const accessTokenExpiration = Number(ACCESS_TOKEN_EXPIRATION);

  const reauthorizeUserService = new ReauthorizeUserService(
    mockAuthTokenGenerator,
  );

  it('should return a refresh token if reauthorized.', async () => {
    const fakeUserId = 'any_user_id';
    const fakeRefreshToken = 'any_refresh_token';
    const fakeNewAccessToken = 'any_new_access_token';

    jest
      .spyOn(mockAuthTokenGenerator, 'validate')
      .mockReturnValueOnce(Promise.resolve(true));

    jest
      .spyOn(mockAuthTokenGenerator, 'getPayload')
      .mockReturnValueOnce(Promise.resolve(fakeUserId));

    jest
      .spyOn(mockAuthTokenGenerator, 'generate')
      .mockReturnValueOnce(Promise.resolve(fakeNewAccessToken));

    const reauthorization = await reauthorizeUserService.execute(
      fakeRefreshToken,
    );

    expect(reauthorization.isRight()).toBeTruthy();
    expect(reauthorization.value).toBe(fakeNewAccessToken);

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledWith(
      fakeRefreshToken,
      secretRefreshToken,
    );
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledWith(
      fakeRefreshToken,
    );
    expect(mockAuthTokenGenerator.generate).toHaveBeenCalledWith(
      fakeUserId,
      secretAccessToken,
      accessTokenExpiration,
    );

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledTimes(1);
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledTimes(1);
    expect(mockAuthTokenGenerator.generate).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError if not reauthorized.', async () => {
    const fakeUserId = 'any_user_id';
    const fakeRefreshToken = 'any_refresh_token';
    const fakeNewAccessToken = 'any_new_access_token';

    jest
      .spyOn(mockAuthTokenGenerator, 'validate')
      .mockReturnValueOnce(Promise.resolve(false));

    const reauthorization = await reauthorizeUserService.execute(
      fakeRefreshToken,
    );

    expect(reauthorization.isLeft()).toBeTruthy();
    expect(reauthorization.value).toEqual(
      new AuthenticationError(HttpStatusCode.UNAUTHORIZED, 'error.message'),
    );

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledWith(
      fakeRefreshToken,
      secretRefreshToken,
    );
    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledTimes(1);
  });
});
