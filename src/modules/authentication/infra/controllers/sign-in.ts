import Joi from 'joi';

import { UserSignedDTO } from '../../data/dtos/user-signed';
import { ApiError } from '../../../../common/errors/api-error';
import { HttpResponse, StatusCode } from '../../../../app/helpers/http';
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
        statusCode: StatusCode.BAD_REQUEST,
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
