import { ApiError } from '../../../../app/helpers/api-error';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { NotAuthorizedError } from '../errors/not-authorized';
import { SECRET_ACCESS_TOKEN } from '../../../../app/helpers/env';
import { IAuthorizeUserService } from './interfaces/authorize-user';
import { Either, left, right } from '../../../../app/helpers/either';
import { AuthorizationDTO } from '../dtos/authorization-credentials';
import { IAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/auth-token-generator';

export class AuthorizeUserService implements IAuthorizeUserService {
  constructor(private readonly authTokenGenerator: IAuthTokenGenerator) {}

  async execute({
    accessToken,
    userId,
  }: AuthorizationDTO): Promise<Either<ApiError, AuthorizationDTO>> {
    const accessTokenRaw = accessToken?.replace('Bearer ', '');

    const isValid: boolean = await this.authTokenGenerator.validate(
      accessTokenRaw,
      SECRET_ACCESS_TOKEN,
    );

    if (!isValid) {
      const error: ApiError = new NotAuthorizedError(
        HttpStatusCode.FORBIDDEN,
        'You are not authorized to perform this action.',
      );
      return left(error);
    }

    const tokenUserId: string = await this.authTokenGenerator.getPayload(
      accessTokenRaw,
    );

    if (userId != undefined && userId != tokenUserId) {
      const error: ApiError = new NotAuthorizedError(
        HttpStatusCode.FORBIDDEN,
        'You are not authorized to perform this action.',
      );
      return left(error);
    }

    const authorizationDTO: AuthorizationDTO = {
      accessToken,
      userId,
    };
    return right(authorizationDTO);
  }
}
