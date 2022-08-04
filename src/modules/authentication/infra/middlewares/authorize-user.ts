import jwt from 'jsonwebtoken';

import { HttpResponse, StatusCode } from '../../../../app/helpers/http';

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
        process.env.SECRET_ACCESS_TOKEN ?? '',
      ) as Payload;

      if (userId != '' && userId != payload.userId) {
        return {
          statusCode: StatusCode.FORBIDDEN,
          data: 'You are not authorized to perform this action.',
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: StatusCode.UNAUTHORIZED,
          data: 'You are not authorized to perform this action.',
        };
      }
    }

    return {
      statusCode: StatusCode.OK,
      data: 'ok',
    };
  }
}
