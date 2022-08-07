import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { UserCredentialsDTO } from '../../dtos/user-credentials';
import { ApiError } from '../../../../../app/helpers/api-error';

export interface ISignInUserUsecase {
  execute({
    email,
    password,
  }: UserCredentialsDTO): Promise<Either<ApiError, UserSignedDTO>>;
}
