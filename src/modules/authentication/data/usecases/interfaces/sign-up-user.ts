import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { UserRegisterDTO } from '../../dtos/user-register';
import { BaseError } from '../../../../../common/errors/base-error';

export interface ISignUpUserUsecase {
  execute(input: UserRegisterDTO): Promise<Either<BaseError, UserSignedDTO>>;
}
