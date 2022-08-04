import { ApiError } from '../../../../common/errors/api-error';
import { HttpResponse, StatusCode } from '../../../../app/helpers/http';
import {
  IGenerateRecoveryCodeUsecase,
  UserEmailDTO,
} from '../../data/usecases/interfaces/generate-recovery-code';
import { ServerError } from '../../../../common/errors/server';

export type GenerateRecoveryCodeRequest = {
  email: string;
};

export class GenerateRecoveryCodeController {
  constructor(
    private readonly generateRecoveryCodeUsecase: IGenerateRecoveryCodeUsecase,
  ) {}

  async handle({ email }: GenerateRecoveryCodeRequest): Promise<HttpResponse> {
    if (!!!email.trim()) {
      return {
        statusCode: StatusCode.BAD_REQUEST,
        data: `The ${email} must not be empty.`,
      };
    }

    const userEmail: UserEmailDTO = { email };
    const recoveryCodeOrError = await this.generateRecoveryCodeUsecase.execute(
      userEmail,
    );

    if (recoveryCodeOrError.isLeft()) {
      const error: ApiError = recoveryCodeOrError.value;
      return {
        statusCode: error.status,
        data: error.message,
      };
    }

    const recoveryCode = recoveryCodeOrError.value;

    return {
      statusCode: StatusCode.OK,
      data: recoveryCode.code,
    };
  }
}
