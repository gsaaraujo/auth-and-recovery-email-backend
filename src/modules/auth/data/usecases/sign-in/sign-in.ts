import { UserSignedDTO } from '../../dtos/user-signed';
import { Either } from '../../../../../app/helpers/either';
import { UserCredentialsDTO } from '../../dtos/user-credentials';

export interface ISignInUsecase {
  execute(input: UserCredentialsDTO): Promise<Either<Error, UserSignedDTO>>;
}
