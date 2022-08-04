import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ApiError } from '../../../../common/errors/api-error';
import { HttpResponse, StatusCode } from '../../../../app/helpers/http';
import { ISignUpUserUsecase } from '../../data/usecases/interfaces/sign-up-user';

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export class SignUpController {
  constructor(private readonly signUpUserUsecase: ISignUpUserUsecase) {}

  async handle({
    name,
    email,
    password,
  }: SignUpRequest): Promise<HttpResponse> {
    if (!!!name.trim() || !!!email.trim() || !!!password.trim()) {
      let field = name.trim() === '' ? 'name' : 'email';
      field = password.trim() === '' ? 'password' : field;
      return {
        statusCode: StatusCode.BAD_REQUEST,
        data: `The ${field} must not be empty.`,
      };
    }

    const userSignedOrError = await this.signUpUserUsecase.execute({
      name,
      email,
      password,
    });

    if (userSignedOrError.isLeft()) {
      const error: ApiError = userSignedOrError.value;
      return {
        statusCode: error.status,
        data: error.message,
      };
    }

    const userSigned: UserSignedDTO = userSignedOrError.value;
    return {
      statusCode: StatusCode.CREATED,
      data: userSigned,
    };
  }
}
