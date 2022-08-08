import { Either } from '../../../../../app/helpers/either';
import { ApiError } from '../../../../../app/helpers/api-error';
import { AuthorizationDTO } from '../../dtos/authorization-credentials';

export interface IAuthorizeUserService {
  execute({
    accessToken,
    userId,
  }: AuthorizationDTO): Promise<Either<ApiError, AuthorizationDTO>>;
}
