import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../common/errors/base-error';
import { RecoveryCodeModel } from '../models/recovery-code';

export interface IRecoveryCodeRepository {
  create(
    code: RecoveryCodeModel,
  ): Promise<Either<BaseError, RecoveryCodeModel>>;
}
