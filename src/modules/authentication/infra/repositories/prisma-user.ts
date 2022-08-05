import { UserModel } from '../../data/models/user';
import { StatusCode } from '../../../../app/helpers/http';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { ApiError } from '../../../../common/errors/api-error';
import { IUserRepository } from '../../data/ports/user-repository';
import { DatabaseError } from '../../../../common/errors/database';
import { Either, left, right } from '../../../../app/helpers/either';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create({
    id,
    name,
    email,
    password,
  }: UserModel): Promise<Either<ApiError, UserModel>> {
    try {
      const user: User | null = await this.prisma.user.create({
        data: { id, name, email, password },
      });

      const userModel: UserModel = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      };

      return right(userModel);
    } catch (error) {
      const databaseError = new DatabaseError(
        StatusCode.INTERNAL_SERVER_ERROR,
        'Database error.',
      );
      return left(databaseError);
    }
  }

  async findOneByEmail(
    email: string,
  ): Promise<Either<ApiError, UserModel | null>> {
    try {
      const user: User | null = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user == null) return right(null);

      const userModel: UserModel = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      };

      return right(userModel);
    } catch (error) {
      const databaseError = new DatabaseError(
        StatusCode.INTERNAL_SERVER_ERROR,
        'Database error.',
      );
      return left(databaseError);
    }
  }
}
