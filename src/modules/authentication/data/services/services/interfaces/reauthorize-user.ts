import { Either } from '../../../../../../app/helpers/either';
import { BaseError } from '../../../../../../common/errors/base-error';

export interface IReauthorizeUserService {
  execute(refreshToken: string): Promise<Either<BaseError, string>>;
}
