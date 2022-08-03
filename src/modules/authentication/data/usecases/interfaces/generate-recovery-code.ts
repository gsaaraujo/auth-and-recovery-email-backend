import { Either } from '../../../../../app/helpers/either';
import { BaseError } from '../../../../../common/errors/base-error';

export type UserEmailDTO = {
  email: string;
};

export type RecoveryCodeDTO = {
  code: string;
};

export interface IGenerateRecoveryCodeUsecase {
  execute(input: UserEmailDTO): Promise<Either<BaseError, RecoveryCodeDTO>>;
}
