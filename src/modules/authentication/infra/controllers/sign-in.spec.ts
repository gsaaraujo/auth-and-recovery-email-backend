import SignInController from './sign-in';
import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ISignInUserUsecase } from '../../data/usecases/interfaces/sign-in-user';
import { Left, Right } from '../../../../app/helpers/either';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../app/helpers/api-error';

class AnyError extends ApiError {}

describe('SignInController -> handle()', () => {
  const fakeUserSignedDTO: UserSignedDTO = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_access_token',
    refreshToken: 'any_refresh_token',
  };

  const mockSignInUserUsecase: jest.Mocked<ISignInUserUsecase> = {
    execute: jest.fn(),
  };

  const signInController = new SignInController(mockSignInUserUsecase);

  it('should response OK and return UserSignedDTO.', async () => {
    const fakeEmail = 'any_email';
    const fakePassword = 'any_password';
    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.OK,
      data: fakeUserSignedDTO,
    };

    jest
      .spyOn(mockSignInUserUsecase, 'execute')
      .mockReturnValueOnce(Promise.resolve(new Right(fakeUserSignedDTO)));

    const httpResponse = await signInController.handle({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse).toEqual(fakeResponse);
    expect(mockSignInUserUsecase.execute).toBeCalledWith({
      email: fakeEmail,
      password: fakePassword,
    });
    expect(mockSignInUserUsecase.execute).toBeCalledTimes(1);
  });

  it('should return BAD_REQUEST if email is empty.', async () => {
    const fakeEmail = '';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse: HttpResponse = await signInController.handle({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return BAD_REQUEST if email length exceeds 255 characters.', async () => {
    const fakeEmail = 'Lorem'.repeat(255);
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse: HttpResponse = await signInController.handle({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return BAD_REQUEST if password is empty.', async () => {
    const fakeEmail = 'any_email';
    const fakePassword = '';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse: HttpResponse = await signInController.handle({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return BAD_REQUEST if password length exceeds 255 characters.', async () => {
    const fakeEmail = 'any_email';
    const fakePassword = 'Lorem'.repeat(255);

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_error_message',
    };

    const httpResponse: HttpResponse = await signInController.handle({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toEqual(fakeResponse.status);
  });

  it('should return Error if signInUsecase returns Error.', async () => {
    const fakeEmail = 'any_email';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.NOT_FOUND,
      data: 'any_message_error',
    };

    jest
      .spyOn(mockSignInUserUsecase, 'execute')
      .mockReturnValueOnce(
        Promise.resolve(
          new Left(new AnyError(HttpStatusCode.NOT_FOUND, 'any_message_error')),
        ),
      );

    const httpResponse: HttpResponse = await signInController.handle({
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse).toEqual(fakeResponse);
    expect(mockSignInUserUsecase.execute).toBeCalledWith({
      email: fakeEmail,
      password: fakePassword,
    });
    expect(mockSignInUserUsecase.execute).toBeCalledTimes(1);
  });
});
