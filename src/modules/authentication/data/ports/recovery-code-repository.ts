import { Either } from '../../../../app/helpers/either';
import { ApiError } from '../../../../common/errors/api-error';
import { RecoveryCodeModel } from '../models/recovery-code';

export interface IRecoveryCodeRepository {
  create(code: RecoveryCodeModel): Promise<Either<ApiError, RecoveryCodeModel>>;
}
