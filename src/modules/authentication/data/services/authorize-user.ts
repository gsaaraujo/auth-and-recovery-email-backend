import jwt from 'jsonwebtoken';

import { IUserRepository } from '../ports/user-repository';
import { BaseError } from '../../../../common/errors/base-error';
import { IAuthorizeUserService } from './contracts/authorize-user';
import { Either, left, right } from '../../../../app/helpers/either';
import { NotAuthorizedError } from '../../domain/errors/not-authorized';

export class AuthorizeUserService implements IAuthorizeUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async verifyAuthorization(
    accessToken: string,
  ): Promise<Either<BaseError, void>> {
    const accessTokenRaw = accessToken?.replace('Bearer ', '');

    try {
      const payload: any = jwt.verify(
        accessTokenRaw,
        process.env.SECRET_ACCESS_TOKEN ?? '',
      );

      const userOrError = await this.userRepository.findOneById(payload.userId);

      if (userOrError.isLeft()) {
        const error: BaseError = userOrError.value;
        return left(new NotAuthorizedError(error.message));
      }
    } catch (error) {
      if (error instanceof Error) {
        return left(new NotAuthorizedError(error.message));
      }
    }

    return right(undefined);
  }
}
