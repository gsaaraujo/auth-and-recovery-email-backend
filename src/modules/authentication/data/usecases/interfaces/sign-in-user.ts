import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { UserCredentialsDTO } from '../../dtos/user-credentials';
import { ApiError } from '../../../../../common/errors/api-error';

export interface ISignInUserUsecase {
  execute(input: UserCredentialsDTO): Promise<Either<ApiError, UserSignedDTO>>;
}
