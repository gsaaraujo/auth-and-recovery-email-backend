import {
  ok,
  badRequest,
  HttpResponse,
  internalServerError,
} from '../../../../app/helpers/http';
import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ServerError } from '../../../../common/errors/server';
import { UserCredentialsDTO } from '../../data/dtos/user-credentials';
import { MissingParamError } from '../../../../common/errors/missing-param';
import { ISignInUserUsecase } from '../../data/usecases/interfaces/sign-in-user';

export type SignInRequest = {
  email: string;
  password: string;
};

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUserUsecase) {}

  async handle({ email, password }: SignInRequest): Promise<HttpResponse> {
    try {
      if (!!!email.trim() || !!!password.trim()) {
        const field = email.trim() == '' ? 'email' : 'password';
        return badRequest(new MissingParamError(field));
      }

      const userCredentialsDTO: UserCredentialsDTO = { email, password };
      const userSignedOrError = await this.signInUsecase.execute(
        userCredentialsDTO,
      );

      if (userSignedOrError.isLeft()) {
        const error = userSignedOrError.value;
        return badRequest(error);
      }

      const userSignedDTO: UserSignedDTO = userSignedOrError.value;
      return ok(userSignedDTO);
    } catch (error) {
      return internalServerError(new ServerError('Server error !'));
    }
  }
}
