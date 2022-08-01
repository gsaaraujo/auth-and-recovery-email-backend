import { left, right } from '../../../../app/helpers/either';
import {
  badRequest,
  HttpResponse,
  internalServerError,
  ok,
} from '../../../../app/helpers/http';
import { BaseError } from '../../../../common/errors/base-error';
import { MissingParamError } from '../../../../common/errors/missing-param';
import { ServerError } from '../../../../common/errors/server';
import { UserRegisterDTO } from '../../data/dtos/user-register';
import { UserSignedDTO } from '../../data/dtos/user-signed';
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
    try {
      if (!!!name.trim() || !!!email.trim() || !!!password.trim()) {
        let field = name.trim() === '' ? 'name' : 'email';
        field = password.trim() === '' ? 'password' : field;
        return badRequest(new MissingParamError(field));
      }

      const userRegisterDTO: UserRegisterDTO = {
        name,
        email,
        password,
      };

      const userSignedOrError = await this.signUpUserUsecase.execute(
        userRegisterDTO,
      );

      if (userSignedOrError.isLeft()) {
        const error: BaseError = userSignedOrError.value;
        return badRequest(error);
      }

      const userSignedDTO: UserSignedDTO = userSignedOrError.value;
      return ok(userSignedDTO);
    } catch (error) {
      return internalServerError(new ServerError('Server error !'));
    }
  }
}
