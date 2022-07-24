import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';

export interface ISignInUsecase {
  execute(
    email: string,
    password: string,
  ): Promise<Either<Error, UserSignedDTO>>;
}
