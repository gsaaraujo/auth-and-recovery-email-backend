import { PrismaClient } from '@prisma/client';
import { SignInService } from '../../data/services/sign-in';
import SignInController from '../../adapters/controllers/sign-in';
import { PrismaUserRepository } from '../../adapters/repositories/prisma-user';

const prismaClient = new PrismaClient();
const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signInService = new SignInService(prismaUserRepository);
const signInController = new SignInController(signInService);

export { signInController };
