import Joi from 'joi';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../app/helpers/api-error';
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
    try {
      const schema = Joi.object<ReauthorizeUserRequest>({
        refreshToken: Joi.string().trim().required().max(255),
      });

      const { value, error } = schema.validate({ refreshToken });

      if (error) {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          data: error.message,
        };
      }

      const newAccessTokenOrError = await this.reauthorizeUserService.execute(
        value.refreshToken,
      );

      if (newAccessTokenOrError.isLeft()) {
        const error: ApiError = newAccessTokenOrError.value;
        return {
          status: error.status,
          data: error.message,
        };
      }

      const newAccessToken: string = newAccessTokenOrError.value;
      return {
        status: HttpStatusCode.OK,
        data: newAccessToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: 403,
          data: error.message,
        };
      }

      return {
        status: 500,
        data: 'Server error',
      };
    }
  }
}
