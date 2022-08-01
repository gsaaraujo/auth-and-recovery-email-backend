import { PrismaClient } from '@prisma/client';
import SignInController from '../../infra/controllers/sign-in';
import { SignInUserUsecase } from '../../data/usecases/sign-in-user';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user';

const prismaClient = new PrismaClient();
const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signInService = new SignInUserUsecase(prismaUserRepository);
const signInController = new SignInController(signInService);

export { signInController };
