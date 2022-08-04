import { Prisma, PrismaClient } from '@prisma/client';
import { StatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../common/errors/api-error';
import { DatabaseError } from '../../../../common/errors/database';
import { RecoveryCodeModel } from '../../data/models/recovery-code';
import { Either, left, right } from '../../../../app/helpers/either';
import { IRecoveryCodeRepository } from '../../data/ports/recovery-code-repository';

export class PrismaRecoveryCodeRepository implements IRecoveryCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    id,
    userId,
    code,
  }: RecoveryCodeModel): Promise<Either<ApiError, RecoveryCodeModel>> {
    try {
      const recoveryCode = await this.prisma.recoveryCode.upsert({
        create: { id, userId, code },
        where: { userId },
        update: {
          id,
          userId,
          code,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      return right(recoveryCode);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const databaseError = new DatabaseError(
          StatusCode.BAD_GATEWAY,
          error.message,
        );
        return left(databaseError);
      }

      const databaseError = new DatabaseError(
        StatusCode.BAD_GATEWAY,
        'Database error.',
      );
      return left(databaseError);
    }
  }
}
