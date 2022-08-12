import { AuthorizeUserController } from './authorize-user';
import { IAuthorizeUserService } from '../../data/services/interfaces/authorize-user';
import { AuthorizationDTO } from '../../data/dtos/authorization-credentials';
import { Left, Right } from '../../../../app/helpers/either';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../app/helpers/api-error';

class AnyError extends ApiError {}

describe('Authorize -> handle()', () => {
  const fakeAuthorizationDTO: AuthorizationDTO = {
    accessToken: 'any_access_token',
    userId: 'any_user_id',
  };

  const mockAuthorizeUserService: jest.Mocked<IAuthorizeUserService> = {
    execute: jest.fn(),
  };

  const authorizeUserController = new AuthorizeUserController(
    mockAuthorizeUserService,
  );

  it('should return OK with authorizationDTO if user is authorized', async () => {
    const fakeAccesToken = 'any_access_token';
    const fakeUserId = 'any_user_id';

    jest
      .spyOn(mockAuthorizeUserService, 'execute')
      .mockReturnValueOnce(Promise.resolve(new Right(fakeAuthorizationDTO)));

    const httpResponse = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(httpResponse).toEqual({
      status: HttpStatusCode.OK,
      data: fakeAuthorizationDTO,
    });
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledWith({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledTimes(1);
  });

  it('should return Error if authorizeUserService returns Error', async () => {
    const fakeUserId = 'any_user_id';
    const fakeAccesToken = 'any_access_token';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.NOT_FOUND,
      data: 'any_message_error',
    };

    jest
      .spyOn(mockAuthorizeUserService, 'execute')
      .mockReturnValueOnce(
        Promise.resolve(
          new Left(new AnyError(HttpStatusCode.NOT_FOUND, 'any_message_error')),
        ),
      );

    const httpResponse = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledWith({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledTimes(1);
  });

  it('should return BAD_REQUEST if access token is empty.', async () => {
    const fakeAccesToken = '';
    const fakeUserId = 'any_user_id';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return BAD_REQUEST if access token length exceeds 255 characters.', async () => {
    const fakeAccesToken = 'Lorem'.repeat(255);
    const fakeUserId = 'any_user_id';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return BAD_REQUEST if user id is empty.', async () => {
    const fakeAccesToken = 'any_access_token';
    const fakeUserId = '';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return BAD_REQUEST if user id length exceeds 255 characters.', async () => {
    const fakeAccesToken = 'any_access_token';
    const fakeUserId =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi' +
      'ut aliquip ex ea commodo consequat.';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });
});
