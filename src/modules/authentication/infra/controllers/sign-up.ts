import Joi from 'joi';

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
    const schema = Joi.object<SignUpRequest>({
      name: Joi.string().trim().required().max(255),
      email: Joi.string().trim().required().max(255),
      password: Joi.string().trim().required().max(255),
    });

    const { value, error } = schema.validate({ name, email, password });

    if (error) {
      return {
        statusCode: StatusCode.BAD_REQUEST,
        data: error.message,
      };
    }

    const userSignedOrError = await this.signUpUserUsecase.execute({
      name: value.name,
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
      statusCode: StatusCode.CREATED,
      data: userSigned,
    };
  }
}
