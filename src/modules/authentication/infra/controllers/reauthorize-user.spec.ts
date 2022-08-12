import { ReauthorizeUserController } from './reauthorize-user';
import { Left, Right } from '../../../../app/helpers/either';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../app/helpers/api-error';
import { IReauthorizeUserService } from '../../data/services/interfaces/reauthorize-user';

class AnyError extends ApiError {}

describe('Reauthorize -> execute()', () => {
  const mockReauthorizeUserService: jest.Mocked<IReauthorizeUserService> = {
    execute: jest.fn(),
  };

  const reauthorizeUserController = new ReauthorizeUserController(
    mockReauthorizeUserService,
  );

  it('should return OK with new access token if user is reauthorized.', async () => {
    const fakeRefreshToken = 'any_refresh_token';
    const fakeNewAccessToken = 'any_new_access_token';

    jest
      .spyOn(mockReauthorizeUserService, 'execute')
      .mockReturnValueOnce(Promise.resolve(new Right(fakeNewAccessToken)));

    const httpResponse = await reauthorizeUserController.handle({
      refreshToken: fakeRefreshToken,
    });

    expect(httpResponse).toEqual({
      status: HttpStatusCode.OK,
      data: fakeNewAccessToken,
    });
    expect(mockReauthorizeUserService.execute).toHaveBeenCalledWith(
      fakeRefreshToken,
    );
    expect(mockReauthorizeUserService.execute).toHaveBeenCalledTimes(1);
  });

  it('should return BAD_REQUEST if refresh token provided is empty.', async () => {
    const fakeRefreshToken = '';

    const httpResponse = await reauthorizeUserController.handle({
      refreshToken: fakeRefreshToken,
    });

    expect(httpResponse.status).toBe(400);
  });

  it('should return BAD_REQUEST if refresh token length provided exceeds 255 characters.', async () => {
    const fakeRefreshToken =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi' +
      'ut aliquip ex ea commodo consequat.';

    const httpResponse = await reauthorizeUserController.handle({
      refreshToken: fakeRefreshToken,
    });

    expect(httpResponse.status).toBe(400);
  });

  it('should return Error if reauthorizeUserService returns an error.', async () => {
    const fakeRefreshToken = 'any_refresh_token';

    jest
      .spyOn(mockReauthorizeUserService, 'execute')
      .mockReturnValueOnce(
        Promise.resolve(
          new Left(new AnyError(HttpStatusCode.NOT_FOUND, 'any_error')),
        ),
      );

    const httpResponse = await reauthorizeUserController.handle({
      refreshToken: fakeRefreshToken,
    });

    expect(httpResponse).toEqual({
      status: HttpStatusCode.NOT_FOUND,
      data: 'any_error',
    });
    expect(mockReauthorizeUserService.execute).toHaveBeenCalledWith(
      fakeRefreshToken,
    );
    expect(mockReauthorizeUserService.execute).toHaveBeenCalledTimes(1);
  });
});
