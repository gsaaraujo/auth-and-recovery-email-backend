import { ApiError } from '../../../../app/helpers/api-error';
import { Left, Right } from '../../../../app/helpers/either';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ISignUpUserUsecase } from '../../data/usecases/interfaces/sign-up-user';
import { SignUpController } from './sign-up';

class AnyError extends ApiError {}

describe('SignUpController -> handle()', () => {
  const fakeUserSignedDTO: UserSignedDTO = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_access_token',
    refreshToken: 'any_refresh_token',
  };

  const mockSignUpUserUsecase: jest.Mocked<ISignUpUserUsecase> = {
    execute: jest.fn(),
  };

  const signUpUserController = new SignUpController(mockSignUpUserUsecase);

  it('should return status CREATED and userSignedDTO if user signed up.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'any_email';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.CREATED,
      data: fakeUserSignedDTO,
    };

    jest
      .spyOn(mockSignUpUserUsecase, 'execute')
      .mockReturnValueOnce(Promise.resolve(new Right(fakeUserSignedDTO)));

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
    expect(mockSignUpUserUsecase.execute).toBeCalledWith({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });
    expect(mockSignUpUserUsecase.execute).toBeCalledTimes(1);
  });

  it('should return status BAD_REQUEST if name is empty.', async () => {
    const fakeName = '';
    const fakeEmail = 'any_email';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_message_error',
    };

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
  });

  it('should return status BAD_REQUEST if name length exceeds 255 characters.', async () => {
    const fakeName = 'Lorem'.repeat(255);
    const fakeEmail = 'any_email';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_message_error',
    };

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
  });

  it('should return status BAD_REQUEST if email is empty.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = '';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_message_error',
    };

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
  });

  it('should return status BAD_REQUEST if email length exceeds 255 characters.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'Lorem'.repeat(255);
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_message_error',
    };

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
  });

  it('should return status BAD_REQUEST if password is empty.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'any_email';
    const fakePassword = '';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_message_error',
    };

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
  });

  it('should return status BAD_REQUEST if password length exceeds 255 characters.', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'any_email';
    const fakePassword = 'Lorem'.repeat(255);

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      data: 'any_message_error',
    };

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
  });

  it('should return Error if signUpUserUsecase return Error', async () => {
    const fakeName = 'any_name';
    const fakeEmail = 'any_email';
    const fakePassword = 'any_password';

    const fakeResponse: HttpResponse = {
      status: HttpStatusCode.NOT_FOUND,
      data: 'any_message_error',
    };

    jest
      .spyOn(mockSignUpUserUsecase, 'execute')
      .mockReturnValueOnce(
        Promise.resolve(
          new Left(new AnyError(HttpStatusCode.NOT_FOUND, 'any_message_error')),
        ),
      );

    const httpResponse: HttpResponse = await signUpUserController.handle({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });

    expect(httpResponse.status).toBe(fakeResponse.status);
    expect(mockSignUpUserUsecase.execute).toBeCalledWith({
      name: fakeName,
      email: fakeEmail,
      password: fakePassword,
    });
    expect(mockSignUpUserUsecase.execute).toBeCalledTimes(1);
  });
});
