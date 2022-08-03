import { PrismaClient } from '@prisma/client';
import { GenerateRecoveryCodeUsecase } from '../../data/usecases/generate-recovery-code';
import { GenerateRecoveryCodeController } from '../../infra/controllers/generate-recovery-code';
import { PrismaRecoveryCodeRepository } from '../../infra/repositories/prisma-recovery-code';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user';
import { NodemailerEmailService } from '../../infra/services/nodemailer-email';

const prismaClient = new PrismaClient();
const prismaUserRepository = new PrismaUserRepository(prismaClient);
const prismaRecoveryCodeRepository = new PrismaRecoveryCodeRepository(
  prismaClient,
);
const nodemailerEmailService = new NodemailerEmailService();
const generateRecoveryCodeUsecase = new GenerateRecoveryCodeUsecase(
  nodemailerEmailService,
  prismaUserRepository,
  prismaRecoveryCodeRepository,
);
const generateRecoveryCodeController = new GenerateRecoveryCodeController(
  generateRecoveryCodeUsecase,
);

export { generateRecoveryCodeController };
