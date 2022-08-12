import { SECRET_ACCESS_TOKEN } from '../../../../app/helpers/env';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { IAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/auth-token-generator';
import { NotAuthorizedError } from '../errors/not-authorized';
import { AuthorizeUserService } from './authorize-user';

describe('Authorize-user -> execute()', () => {
  const fakeAuthorizationDTOWithUserId = {
    accessToken: 'any_access_token',
    userId: 'any_user_id',
  };

  const fakeAuthorizationDTOWithoutUserId = {
    accessToken: 'any_access_token',
  };

  const secretAccessToken = SECRET_ACCESS_TOKEN;

  const mockAuthTokenGenerator: jest.Mocked<IAuthTokenGenerator> = {
    generate: jest.fn(),
    validate: jest.fn(),
    getPayload: jest.fn(),
  };

  const authorizeUserService = new AuthorizeUserService(mockAuthTokenGenerator);

  it('should return authorizationDTO if user is authorized and body has userId that matches with payload.', async () => {
    const fakeUserId = 'any_user_id';
    const fakeUserIdPayload = fakeUserId;
    const fakeAccessToken = 'any_access_token';

    jest
      .spyOn(mockAuthTokenGenerator, 'validate')
      .mockReturnValueOnce(Promise.resolve(true));

    jest
      .spyOn(mockAuthTokenGenerator, 'getPayload')
      .mockReturnValueOnce(Promise.resolve(fakeUserIdPayload));

    const authorizationDTO = await authorizeUserService.execute({
      accessToken: fakeAccessToken,
      userId: fakeUserId,
    });

    expect(authorizationDTO.isRight()).toBeTruthy();
    expect(authorizationDTO.value).toEqual(fakeAuthorizationDTOWithUserId);
    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledWith(
      fakeAccessToken,
      secretAccessToken,
    );
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledWith(
      fakeAccessToken,
    );

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledTimes(1);
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledTimes(1);
  });

  it('should return authorizationDTO if user is authorized and body has no userId', async () => {
    const fakeUserIdPayload = 'any_user_id_payload';
    const fakeAccessToken = 'any_access_token';

    jest
      .spyOn(mockAuthTokenGenerator, 'validate')
      .mockReturnValueOnce(Promise.resolve(true));

    jest
      .spyOn(mockAuthTokenGenerator, 'getPayload')
      .mockReturnValueOnce(Promise.resolve(fakeUserIdPayload));

    const authorizationDTO = await authorizeUserService.execute({
      accessToken: fakeAccessToken,
    });

    expect(authorizationDTO.isRight()).toBeTruthy();
    expect(authorizationDTO.value).toEqual(fakeAuthorizationDTOWithoutUserId);
    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledWith(
      fakeAccessToken,
      secretAccessToken,
    );
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledWith(
      fakeAccessToken,
    );

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledTimes(1);
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledTimes(1);
  });

  it('should return NotAuthorizedError if access token is not valid.', async () => {
    const fakeUserId = 'any_user_id';
    const fakeAccessToken = 'any_access_token';

    jest
      .spyOn(mockAuthTokenGenerator, 'validate')
      .mockReturnValueOnce(Promise.resolve(false));

    const authorizationDTO = await authorizeUserService.execute({
      accessToken: fakeAccessToken,
      userId: fakeUserId,
    });

    expect(authorizationDTO.isLeft()).toBeTruthy();
    expect(authorizationDTO.value).toEqual(
      new NotAuthorizedError(
        HttpStatusCode.FORBIDDEN,
        'You are not authorized to perform this action.',
      ),
    );
    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledWith(
      fakeAccessToken,
      secretAccessToken,
    );

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledTimes(1);
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledTimes(0);
  });

  it('should return NotAuthorizedError if body has userId that does not matches with payload.', async () => {
    const fakeUserId = 'any_user_id';
    const fakeUserIdPayload = 'any_user_id_payload';
    const fakeAccessToken = 'any_access_token';

    jest
      .spyOn(mockAuthTokenGenerator, 'validate')
      .mockReturnValueOnce(Promise.resolve(true));

    jest
      .spyOn(mockAuthTokenGenerator, 'getPayload')
      .mockReturnValueOnce(Promise.resolve(fakeUserIdPayload));

    const authorizationDTO = await authorizeUserService.execute({
      accessToken: fakeAccessToken,
      userId: fakeUserId,
    });

    expect(authorizationDTO.isLeft()).toBeTruthy();
    expect(authorizationDTO.value).toEqual(
      new NotAuthorizedError(
        HttpStatusCode.FORBIDDEN,
        'You are not authorized to perform this action.',
      ),
    );
    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledWith(
      fakeAccessToken,
      secretAccessToken,
    );
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledWith(
      fakeAccessToken,
    );

    expect(mockAuthTokenGenerator.validate).toHaveBeenCalledTimes(1);
    expect(mockAuthTokenGenerator.getPayload).toHaveBeenCalledTimes(1);
  });
});
