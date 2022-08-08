import { PrismaClient } from '@prisma/client';
import SignInController from '../../infra/controllers/sign-in';
import { SignInUserUsecase } from '../../data/usecases/sign-in-user';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user';
import { ArgoEncrypter } from '../../../../app/utils/encrypter/argo-encrypter';
import { JwtAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/jwt-auth-token-generator';

const prismaClient = new PrismaClient();
const encrypter = new ArgoEncrypter();
const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();

const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signInService = new SignInUserUsecase(
  prismaUserRepository,
  encrypter,
  jwtAuthTokenGenerator,
);
const signInController = new SignInController(signInService);

export { signInController };
