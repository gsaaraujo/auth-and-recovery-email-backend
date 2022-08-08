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
import { IAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/auth-token-generator';
export class JWTReauthorizeUserService implements IReauthorizeUserService {
  constructor(private readonly authTokenGenerator: IAuthTokenGenerator) {}

  async execute(refreshToken: string): Promise<Either<ApiError, string>> {
    const refreshTokenRaw = refreshToken?.replace('Bearer ', '');

    const isValid: boolean = await this.authTokenGenerator.isValid(
      refreshTokenRaw,
      SECRET_REFRESH_TOKEN,
    );

    if (!isValid) {
      const authenticationError = new AuthenticationError(
        HttpStatusCode.UNAUTHORIZED,
        'error.message',
      );
      return left(authenticationError);
    }

    const userId = await this.authTokenGenerator.getUserId(refreshTokenRaw);

    const newAccessToken: string = await this.authTokenGenerator.generate(
      userId,
      SECRET_ACCESS_TOKEN,
      Number(ACCESS_TOKEN_EXPIRATION),
    );
    return right(newAccessToken);
  }
}
