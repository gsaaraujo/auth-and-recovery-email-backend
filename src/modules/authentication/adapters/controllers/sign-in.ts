import {
  ok,
  badRequest,
  HttpRequest,
  HttpResponse,
  internalServerError,
} from '../../../../app/helpers/http';
import { MissingParamError } from '../../../../common/errors/missing-param';
import { ServerError } from '../../../../common/errors/server';
import { UserSignedEntity } from '../../domain/entities/user-signed';
import { ISignInUserUsecase } from '../../data/usecases/interfaces/sign-in-user';

export type SignInRequest = {
  email: string;
  password: string;
};

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUserUsecase) {}

  async handle(request: HttpRequest<SignInRequest>): Promise<HttpResponse> {
    try {
      const { email, password } = request.data;

      if (!!!email.trim() || !!!password.trim()) {
        const field = email.trim() == '' ? 'email' : 'password';
        return badRequest(new MissingParamError(field));
      }

      const userSignedOrError = await this.signInUsecase.execute(
        email,
        password,
      );

      if (userSignedOrError.isLeft()) {
        const error = userSignedOrError.value;
        return badRequest(error);
      }

      const userSignedEntity: UserSignedEntity = userSignedOrError.value;
      const data = {
        uid: userSignedEntity.uid,
        name: userSignedEntity.name,
        email: userSignedEntity.email,
        accessToken: userSignedEntity.accessToken,
        refreshToken: userSignedEntity.refreshToken,
      };
      return ok(data);
    } catch (error) {
      return internalServerError(new ServerError('Server error !'));
    }
  }
}
