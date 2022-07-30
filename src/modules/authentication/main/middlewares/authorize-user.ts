import jwt from 'jsonwebtoken';
import {
  forbidden,
  HttpRequest,
  HttpResponse,
  ok,
  unauthorized,
} from '../../../../app/helpers/http';
import { NotAuthorizedError } from './not-authorized';

export type AuthorizeUserParams = {
  accessToken: string;
  userId: string;
};

type Payload = {
  userId: string;
};

export class AuthorizeUserMiddleware {
  authorize(httpRequest: HttpRequest<AuthorizeUserParams>): HttpResponse {
    const { accessToken, userId } = httpRequest.data;
    const accessTokenRaw = accessToken?.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        accessTokenRaw,
        process.env.SECRET_ACCESS_TOKEN ?? '',
      ) as Payload;

      if (userId != '' && userId != payload.userId) {
        return forbidden(
          new NotAuthorizedError(
            'You are not authorized to perform this action.',
          ),
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        return unauthorized(new NotAuthorizedError(error.message));
      }
    }

    return ok('');
  }
}
