import { AuthorizeUserController } from './authorize-user';
import { IAuthorizeUserService } from '../../data/services/interfaces/authorize-user';
import { AuthorizationDTO } from '../../data/dtos/authorization-credentials';
import { Right } from '../../../../app/helpers/either';
import { HttpStatusCode } from '../../../../app/helpers/http';

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

  it('should return response OK with authorizationDTO if user is authorized', async () => {
    const fakeAccesToken = 'any_access_token';
    const fakeUserId = 'any_user_id';

    jest
      .spyOn(mockAuthorizeUserService, 'execute')
      .mockReturnValueOnce(Promise.resolve(new Right(fakeAuthorizationDTO)));

    const authorizeUser = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(authorizeUser).toEqual({
      status: HttpStatusCode.OK,
      data: fakeAuthorizationDTO,
    });
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledWith({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledTimes(1);
  });

  it('should return response BAD_REQUEST if body has invalid inputs.', async () => {
    const fakeAccesToken = '';
    const fakeUserId = '';

    const authorizeUser = await authorizeUserController.handle({
      accessToken: fakeAccesToken,
      userId: fakeUserId,
    });

    expect(authorizeUser.status).toBe(400);
    expect(mockAuthorizeUserService.execute).toHaveBeenCalledTimes(0);
  });
});
