import {
  ok,
  badRequest,
  HttpResponse,
  internalServerError,
} from '../../../../app/helpers/http';
import { ServerError } from '../../../../common/errors/server';
import { MissingParamError } from '../../../../common/errors/missing-param';
import {
  ISignInUserUsecase,
  userCredentialsDTO,
  UserSignedDTO,
} from '../../data/usecases/interfaces/sign-in-user';

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

      const userCredentialsDTO: userCredentialsDTO = { email, password };
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
