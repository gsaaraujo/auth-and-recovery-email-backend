import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';

export type UserDTO = {
  uid: string;
  name: string;
  email: string;
};
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<Either<BaseError, UserDTO>>;
}
