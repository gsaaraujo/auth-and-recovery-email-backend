import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../../../../app/helpers/env';

import { HttpResponse, HttpStatusCode } from '../../../../app/helpers/http';

export type AuthorizeUserRequest = {
  accessToken: string;
  userId: string;
};

type Payload = {
  userId: string;
};

export class AuthorizeUserMiddleware {
  authorize({ accessToken, userId }: AuthorizeUserRequest): HttpResponse {
    const accessTokenRaw = accessToken?.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        accessTokenRaw,
        SECRET_ACCESS_TOKEN,
      ) as Payload;

      if (userId != '' && userId != payload.userId) {
        return {
          status: HttpStatusCode.FORBIDDEN,
          data: 'You are not authorized to perform this action.',
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: HttpStatusCode.UNAUTHORIZED,
          data: 'You are not authorized to perform this action.',
        };
      }
    }

    return {
      status: HttpStatusCode.OK,
      data: 'ok',
    };
  }
}
