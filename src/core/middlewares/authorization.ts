import jwt from 'jsonwebtoken';

import {
  Forbidden,
  HttpRequest,
  HttpResponse,
  Unauthorized,
} from '../../app/helpers/http';

export const authorizationMiddleware = (
  httpRequest: HttpRequest,
): HttpResponse | void => {
  const authorization: string = httpRequest.data;
  const accessToken = authorization?.split(' ')[1] ?? null;

  if (!accessToken) {
    return Unauthorized('Authorization access token is required.');
  }

  return jwt.verify(
    accessToken,
    process.env.SECRET_ACCESS_TOKEN ?? '',
    (error) => {
      if (error == null) return;
      return Forbidden(error.message);
    },
  );
};
