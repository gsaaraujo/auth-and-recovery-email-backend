import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ServerError } from '../../../../common/errors/server';
import { UserCredentialsDTO } from '../../data/dtos/user-credentials';
import { HttpResponse, StatusCode } from '../../../../app/helpers/http';
import { ISignInUserUsecase } from '../../data/usecases/interfaces/sign-in-user';

export type SignInRequest = {
  email: string;
  password: string;
};

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUserUsecase) {}

  async handle({ email, password }: SignInRequest): Promise<HttpResponse> {
    if (!!!email.trim() || !!!password.trim()) {
      const field = email.trim() == '' ? 'email' : 'password';
      return {
        statusCode: StatusCode.BAD_REQUEST,
        data: `The ${field} must not be empty.`,
      };
    }

    const userSignedOrError = await this.signInUsecase.execute({
      email,
      password,
    });

    if (userSignedOrError.isLeft()) {
      const error = userSignedOrError.value;
      return {
        statusCode: error.status,
        data: error.message,
      };
    }

    const userSigned: UserSignedDTO = userSignedOrError.value;
    return {
      statusCode: StatusCode.OK,
      data: userSigned,
    };
  }
}
