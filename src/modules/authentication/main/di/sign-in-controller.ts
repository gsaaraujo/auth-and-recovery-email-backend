import { PrismaClient } from '@prisma/client';
import SignInController from '../../adapters/controllers/sign-in';
import { SignInUserUsecase } from '../../data/usecases/sign-in-user';
import { PrismaUserRepository } from '../../adapters/repositories/prisma-user';
import { ReauthorizeUserController } from '../../adapters/middlewares/reauthorize-user';
import { JWTReauthorizeUserService } from '../../data/services/services/jwt-reauthorize-user';

const prismaClient = new PrismaClient();
const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signInService = new SignInUserUsecase(prismaUserRepository);
const signInController = new SignInController(signInService);

const jwtReauthorizeUserService = new JWTReauthorizeUserService();
const reauthorizeUserController = new ReauthorizeUserController(
  jwtReauthorizeUserService,
);

export { signInController, reauthorizeUserController };
