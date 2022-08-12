import Joi from 'joi';
import { ApiError } from '../../../../app/helpers/api-error';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { AuthorizationDTO } from '../../data/dtos/authorization-credentials';
import { IAuthorizeUserService } from '../../data/services/interfaces/authorize-user';

export type AuthorizeUserRequest = {
  accessToken: string;
  userId: string;
};

export class AuthorizeUserController {
  constructor(private readonly authorizeUserService: IAuthorizeUserService) {}

  async handle({
    accessToken,
    userId,
  }: AuthorizeUserRequest): Promise<HttpResponse> {
    try {
      const schema = Joi.object<AuthorizeUserRequest>({
        accessToken: Joi.string().trim().required().max(255),
        userId: Joi.string().trim().max(255),
      });

      const { value, error } = schema.validate({ accessToken, userId });

      if (error) {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          data: error.message,
        };
      }

      const accessTokenRaw = value.accessToken?.replace('Bearer ', '');

      const authorizedOrError = await this.authorizeUserService.execute({
        accessToken: accessTokenRaw,
        userId,
      });

      if (authorizedOrError.isLeft()) {
        const error: ApiError = authorizedOrError.value;
        return {
          status: error.status,
          data: error.message,
        };
      }

      const authorizationDTO: AuthorizationDTO = authorizedOrError.value;
      return {
        status: HttpStatusCode.OK,
        data: authorizationDTO,
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
