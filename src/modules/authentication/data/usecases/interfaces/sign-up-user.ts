import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { UserRegisterDTO } from '../../dtos/user-register';
import { ApiError } from '../../../../../app/helpers/api-error';

export interface ISignUpUserUsecase {
  execute(input: UserRegisterDTO): Promise<Either<ApiError, UserSignedDTO>>;
}
