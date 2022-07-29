import jwt from 'jsonwebtoken';

import { forbidden, HttpRequest, HttpResponse } from '../../app/helpers/http';

export const authorizationMiddleware = (
  httpRequest: HttpRequest,
): HttpResponse | void => {
  const authorization: string = httpRequest.data;
  const accessToken = authorization?.replace('Bearer ', '') ?? null;

  try {
    jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN ?? '');
  } catch (error) {
    if (error instanceof Error) return forbidden(error.message);
  }
};
