import jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

export const authorizationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const accessToken = request.headers.authorization;

  if (!accessToken) {
    response.status(403).json({
      error: 'Authorization access token is required.',
    });
    return;
  }

  jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN ?? '', (error) => {
    if (error == null) return;

    response.status(403).json({
      error: error.message,
    });
  });

  next();
};
