import { PrismaClient } from '@prisma/client';
import { SignUpController } from '../../infra/controllers/sign-up';
import { SignUpUserUsecase } from '../../data/usecases/sign-up-user';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user';
import { ArgoEncrypter } from '../../../../app/utils/encrypter/argo-encrypter';
import { JwtTokenGenerator } from '../../../../app/utils/token-generator/jwt-token-generator';

const prismaClient = new PrismaClient();
const encrypter = new ArgoEncrypter();
const tokenGenerator = new JwtTokenGenerator();

const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signUpUserUsecase = new SignUpUserUsecase(
  prismaUserRepository,
  encrypter,
  tokenGenerator,
);
const signUpController = new SignUpController(signUpUserUsecase);

export { signUpController };
