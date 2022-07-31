import { Either } from '../../../../../app/helpers/either';
import { BaseError } from '../../../../../common/errors/base-error';

export type userCredentialsDTO = {
  email: string;
  password: string;
};

export type UserSignedDTO = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};
export interface ISignInUserUsecase {
  execute(input: userCredentialsDTO): Promise<Either<BaseError, UserSignedDTO>>;
}
