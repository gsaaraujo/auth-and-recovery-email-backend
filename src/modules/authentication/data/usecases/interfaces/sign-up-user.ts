import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { UserRegisterInfo } from '../../dtos/user-register-info';
import { BaseError } from '../../../../../common/errors/base-error';

export interface ISignUpUserUsecase {
  execute(input: UserRegisterInfo): Promise<Either<BaseError, UserSignedDTO>>;
}
