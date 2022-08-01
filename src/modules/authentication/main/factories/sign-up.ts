import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user';
import { SignUpController } from '../../infra/controllers/sign-up';
import { SignUpUserUsecase } from '../../data/usecases/sign-up-user';

const prismaClient = new PrismaClient();
const prismaUserRepository = new PrismaUserRepository(prismaClient);
const signUpUserUsecase = new SignUpUserUsecase(prismaUserRepository);
const signUpController = new SignUpController(signUpUserUsecase);

export { signUpController };
