import { UserModel } from '../../data/models/user';
import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../../data/ports/user-repository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async exists(email: string): Promise<boolean> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) return true;
    return false;
  }

  async create({ id, name, email, password }: UserModel): Promise<UserModel> {
    const user: User = await this.prisma.user.create({
      data: { id, name, email, password },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }

  async findOneByEmail(email: string): Promise<UserModel | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
}
