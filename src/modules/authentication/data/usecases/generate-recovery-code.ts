import { v4 as uuidv4 } from 'uuid';

import { Either, left, right } from '../../../../app/helpers/either';
import { ApiError } from '../../../../common/errors/api-error';
import { UserEmailEntity } from '../../domain/entities/user-email';
import { UserNotFoundError } from '../errors/user-not-found';
import { RecoveryCodeModel } from '../models/recovery-code';
import { UserModel } from '../models/user';
import { IEmailService } from '../ports/email-service';
import { IRecoveryCodeRepository } from '../ports/recovery-code-repository';
import { IUserRepository } from '../ports/user-repository';
import {
  IGenerateRecoveryCodeUsecase,
  UserEmailDTO,
  RecoveryCodeDTO,
} from './interfaces/generate-recovery-code';

export class GenerateRecoveryCodeUsecase
  implements IGenerateRecoveryCodeUsecase
{
  constructor(
    private readonly emailService: IEmailService,
    private readonly userRepository: IUserRepository,
    private readonly recoveryCodeRepository: IRecoveryCodeRepository,
  ) {}

  async execute({
    email,
  }: UserEmailDTO): Promise<Either<ApiError, RecoveryCodeDTO>> {
    const userEmailEntityOrError = UserEmailEntity.create(email);

    if (userEmailEntityOrError.isLeft()) {
      const error: ApiError = userEmailEntityOrError.value;
      return left(error);
    }

    const userEmailEntity = userEmailEntityOrError.value;

    const userModelOrError = await this.userRepository.findOneByEmail(
      userEmailEntity.email,
    );

    if (userModelOrError.isLeft()) {
      const error: ApiError = userModelOrError.value;
      return left(error);
    }

    const userModel: UserModel | null = userModelOrError.value;

    if (!userModel) {
      return left(
        new UserNotFoundError('No account associated with the email address.'),
      );
    }

    const generateRecoveryCode: string = Math.floor(
      Math.random() * (9999 - 1000) + 1000,
    ).toString();

    const recoveryCodeModel: RecoveryCodeModel = {
      id: uuidv4(),
      userId: userModel.id,
      code: generateRecoveryCode,
    };

    const recoveryCodeOrError = await this.recoveryCodeRepository.create(
      recoveryCodeModel,
    );

    if (recoveryCodeOrError.isLeft()) {
      const error: ApiError = recoveryCodeOrError.value;
      return left(error);
    }

    const sentOrError = await this.emailService.send({
      host: process.env.MAIL_HOST || '',
      port: process.env.MAIL_PORT || '',
      from: 'percy.kihn37@ethereal.email',
      to: 'percy.kihn37@ethereal.email',
      user: process.env.MAIL_USER || '',
      password: process.env.MAIL_PASSWORD || '',
      subject: 'Recovery Password',
      html: `<p>Your recovery password: <b>${recoveryCodeOrError.value.code}</b></p>`,
    });

    if (sentOrError.isLeft()) {
      const error: ApiError = sentOrError.value;
      return left(error);
    }

    const recoveryCodeDTO: RecoveryCodeDTO = {
      code: generateRecoveryCode,
    };
    return right(recoveryCodeDTO);
  }
}
