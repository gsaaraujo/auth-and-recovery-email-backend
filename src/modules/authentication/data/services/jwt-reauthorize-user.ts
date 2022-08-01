import jwt from 'jsonwebtoken';

import { Either, left, right } from '../../../../app/helpers/either';
import { IReauthorizeUserService } from './interfaces/reauthorize-user';
import { BaseError } from '../../../../common/errors/base-error';
import { NotAuthorizedError } from '../../infra/errors/not-authorized';

type Payload = {
  userId: string;
};

export class JWTReauthorizeUserService implements IReauthorizeUserService {
  async execute(refreshToken: string): Promise<Either<BaseError, string>> {
    let newAccessToken = '';
    const refreshTokenRaw = refreshToken?.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        refreshTokenRaw,
        process.env.SECRET_REFRESH_TOKEN ?? '',
      ) as Payload;

      newAccessToken = jwt.sign(
        { userId: payload.userId },
        process.env.SECRET_ACCESS_TOKEN ?? '',
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m' },
      );
    } catch (error) {
      if (error instanceof Error) {
        return left(new NotAuthorizedError(error.message));
      }
    }

    return right(newAccessToken);
  }
}
