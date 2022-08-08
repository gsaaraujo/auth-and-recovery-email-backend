import { SECRET_ACCESS_TOKEN } from '../../../../app/helpers/env';
import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';
import { IAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/auth-token-generator';

export type AuthorizeUserRequest = {
  accessToken: string;
  userId: string;
};

export class AuthorizeUserMiddleware {
  constructor(private readonly authTokenGenerator: IAuthTokenGenerator) {}

  async authorize({
    accessToken,
    userId,
  }: AuthorizeUserRequest): Promise<HttpResponse> {
    const accessTokenRaw = accessToken?.replace('Bearer ', '');

    const isValid: boolean = await this.authTokenGenerator.validate(
      accessTokenRaw,
      SECRET_ACCESS_TOKEN,
    );

    if (!isValid) {
      return {
        status: HttpStatusCode.FORBIDDEN,
        data: 'You are not authorized to perform this action.',
      };
    }

    const tokenUserId: string = await this.authTokenGenerator.getPayload(
      accessTokenRaw,
    );

    if (userId != '' && userId != tokenUserId) {
      return {
        status: HttpStatusCode.FORBIDDEN,
        data: 'You are not authorized to perform this action.',
      };
    }

    return {
      status: HttpStatusCode.OK,
      data: 'ok',
    };
  }
}
