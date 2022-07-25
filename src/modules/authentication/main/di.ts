import { PrismaClient } from '@prisma/client';
import SignInController from '../infra/controllers/sign-in';
import { SignInService } from '../data/usecases/sign-in/sign-in-service';
import { PrismaUserRepository } from '../infra/gateways/prisma-user-repository';

const prismaClient = new PrismaClient();
const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signInService = new SignInService(prismaUserRepository);
const signInController = new SignInController(signInService);

export { signInController };
