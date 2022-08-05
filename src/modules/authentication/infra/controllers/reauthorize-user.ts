import Joi from 'joi';
import { HttpResponse, StatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../common/errors/api-error';
import { IReauthorizeUserService } from '../../data/services/interfaces/reauthorize-user';

export type ReauthorizeUserRequest = {
  refreshToken: string;
};

export class ReauthorizeUserController {
  constructor(
    private readonly reauthorizeUserService: IReauthorizeUserService,
  ) {}

  async handle({
    refreshToken,
  }: ReauthorizeUserRequest): Promise<HttpResponse> {
    const schema = Joi.object<ReauthorizeUserRequest>({
      refreshToken: Joi.string().trim().required().max(255),
    });

    const { value, error } = schema.validate({ refreshToken });

    if (error) {
      return {
        statusCode: StatusCode.BAD_REQUEST,
        data: error.message,
      };
    }

    const newAccessTokenOrError = await this.reauthorizeUserService.execute(
      value.refreshToken,
    );

    if (newAccessTokenOrError.isLeft()) {
      const error: ApiError = newAccessTokenOrError.value;
      return {
        statusCode: error.status,
        data: error.message,
      };
    }

    const newAccessToken: string = newAccessTokenOrError.value;
    return {
      statusCode: StatusCode.OK,
      data: newAccessToken,
    };
  }
}
