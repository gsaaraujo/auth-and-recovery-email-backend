import { UserModel } from '../../data/models/user';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { BaseError } from '../../../../common/errors/base-error';
import { IUserRepository } from '../../data/ports/user-repository';
import { Either, left, right } from '../../../../app/helpers/either';
import { DatabaseError } from '../../../../common/errors/database';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create({
    id,
    name,
    email,
    password,
  }: UserModel): Promise<Either<BaseError, UserModel>> {
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return left(
            new DatabaseError(
              'The email address is already associated with another account.',
            ),
          );
        }
      }

      return left(new DatabaseError('Database error'));
    }
  }

  async findOneByEmail(
    email: string,
  ): Promise<Either<BaseError, UserModel | null>> {
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
      return left(new DatabaseError('Database error'));
    }
  }
}
