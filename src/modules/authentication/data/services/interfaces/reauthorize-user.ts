import { Either } from '../../../../../app/helpers/either';
import { ApiError } from '../../../../../common/errors/api-error';

export interface IReauthorizeUserService {
  execute(refreshToken: string): Promise<Either<ApiError, string>>;
}
