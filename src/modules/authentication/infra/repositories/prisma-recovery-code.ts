import { Prisma, PrismaClient } from '@prisma/client';
import { Either, left, right } from '../../../../app/helpers/either';
import { BaseError } from '../../../../common/errors/base-error';
import { DatabaseError } from '../../../../common/errors/database';
import { RecoveryCodeModel } from '../../data/models/recovery-code';
import { IRecoveryCodeRepository } from '../../data/ports/recovery-code-repository';

export class PrismaRecoveryCodeRepository implements IRecoveryCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    id,
    userId,
    code,
  }: RecoveryCodeModel): Promise<Either<BaseError, RecoveryCodeModel>> {
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
        return left(new DatabaseError(error.message));
      }

      return left(new DatabaseError('Database error'));
    }
  }
}
