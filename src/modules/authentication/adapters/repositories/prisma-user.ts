import { UserModel } from '../../data/models/user';
import { PrismaClient, User } from '@prisma/client';
import { UserNotFoundError } from '../errors/user-not-found';
import { BaseError } from '../../../../core/errors/base-error';
import { IUserRepository } from '../../data/ports/user-repository';
import { Either, left, right } from '../../../../app/helpers/either';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOneByEmail(email: string): Promise<Either<BaseError, UserModel>> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user == null)
      return left(new UserNotFoundError('Email or password is incorrect.'));

    const userModel = new UserModel(
      user.id,
      user.name,
      user.email,
      user.password,
    );
    return right(userModel);
  }
}
