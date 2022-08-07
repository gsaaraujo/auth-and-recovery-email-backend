import jwt from 'jsonwebtoken';

import { HttpStatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../app/helpers/api-error';
import { AuthenticationError } from '../errors/authentication';
import { Either, left, right } from '../../../../app/helpers/either';
import { IReauthorizeUserService } from './interfaces/reauthorize-user';
import {
  ACCESS_TOKEN_EXPIRATION,
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '../../../../app/helpers/env';

type Payload = {
  userId: string;
};

export class JWTReauthorizeUserService implements IReauthorizeUserService {
  async execute(refreshToken: string): Promise<Either<ApiError, string>> {
    let newAccessToken = '';
    const refreshTokenRaw = refreshToken?.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        refreshTokenRaw,
        SECRET_REFRESH_TOKEN,
      ) as Payload;

      newAccessToken = jwt.sign(
        { userId: payload.userId },
        SECRET_ACCESS_TOKEN,
        { expiresIn: ACCESS_TOKEN_EXPIRATION },
      );
    } catch (error) {
      if (error instanceof Error) {
        const authenticationError = new AuthenticationError(
          HttpStatusCode.UNAUTHORIZED,
          error.message,
        );
        return left(authenticationError);
      }
    }

    return right(newAccessToken);
  }
}
