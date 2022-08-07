import { Either } from '../../../../../app/helpers/either';
import { ApiError } from '../../../../../app/helpers/api-error';

export interface IReauthorizeUserService {
  execute(refreshToken: string): Promise<Either<ApiError, string>>;
}
