import { Either } from '../../../../../app/helpers/either';
import { BaseError } from '../../../../../common/errors/base-error';

export interface IAuthorizeUserService {
  verifyAuthorization(accessToken: string): Promise<Either<BaseError, void>>;
}
