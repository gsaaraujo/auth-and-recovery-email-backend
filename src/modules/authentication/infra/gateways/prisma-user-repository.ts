import { UserDTO } from '../../data/dtos/user';
import { PrismaClient, User } from '@prisma/client';
import { UserNotFoundError } from '../errors/user-not-found';
import { BaseError } from '../../../../core/errors/base-error';
import { IUserRepository } from '../../data/ports/user-repository';
import { Either, left, right } from '../../../../app/helpers/either';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOneByEmail(email: string): Promise<Either<BaseError, UserDTO>> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user == null) {
      return left(new UserNotFoundError('Email or password is incorrect.'));
    }

    const userDTO: UserDTO = {
      uid: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    return right(userDTO);
  }
}
