import { Either } from '../../../../../app/helpers/either';
import { ApiError } from '../../../../../common/errors/api-error';

export type UserEmailDTO = {
  email: string;
};

export type RecoveryCodeDTO = {
  code: string;
};

export interface IGenerateRecoveryCodeUsecase {
  execute(input: UserEmailDTO): Promise<Either<ApiError, RecoveryCodeDTO>>;
}
