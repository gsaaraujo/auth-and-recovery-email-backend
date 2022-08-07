import Joi from 'joi';

import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ApiError } from '../../../../app/helpers/api-error';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { ISignInUserUsecase } from '../../data/usecases/interfaces/sign-in-user';

export type SignInRequest = {
  email: string;
  password: string;
};

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUserUsecase) {}

  async handle({ email, password }: SignInRequest): Promise<HttpResponse> {
    const schema = Joi.object<SignInRequest>({
      email: Joi.string().trim().required().max(255),
      password: Joi.string().trim().required().max(255),
    });

    const { value, error } = schema.validate({ email, password });

    if (error) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        data: error.message,
      };
    }

    const userSignedOrError = await this.signInUsecase.execute({
      email: value.email,
      password: value.password,
    });

    if (userSignedOrError.isLeft()) {
      const error: ApiError = userSignedOrError.value;
      return {
        status: error.status,
        data: error.message,
      };
    }

    const userSigned: UserSignedDTO = userSignedOrError.value;
    return {
      status: HttpStatusCode.OK,
      data: userSigned,
    };
  }
}
