import { UserModel } from '../../data/models/user';
import { PrismaClient, User } from '@prisma/client';
import { BaseError } from '../../../../common/errors/base-error';
import { IUserRepository } from '../../data/ports/user-repository';
import { Either, left, right } from '../../../../app/helpers/either';
import { DatabaseError } from '../../../../common/errors/database';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOneByEmail(
    email: string,
  ): Promise<Either<BaseError, UserModel | null>> {
    try {
      const user: User | null = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user == null) return right(null);

      const userModel: UserModel = new UserModel(
        user.id,
        user.name,
        user.email,
        user.password,
      );

      return right(userModel);
    } catch (error) {
      return left(new DatabaseError('Database error'));
    }
  }
}
