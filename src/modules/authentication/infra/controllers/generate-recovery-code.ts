import { ApiError } from '../../../../common/errors/api-error';
import { HttpResponse, StatusCode } from '../../../../app/helpers/http';
import {
  IGenerateRecoveryCodeUsecase,
  UserEmailDTO,
} from '../../data/usecases/interfaces/generate-recovery-code';
import { ServerError } from '../../../../common/errors/server';
import Joi from 'joi';

export type GenerateRecoveryCodeRequest = {
  email: string;
};

export class GenerateRecoveryCodeController {
  constructor(
    private readonly generateRecoveryCodeUsecase: IGenerateRecoveryCodeUsecase,
  ) {}

  async handle({ email }: GenerateRecoveryCodeRequest): Promise<HttpResponse> {
    const schema = Joi.object<GenerateRecoveryCodeRequest>({
      email: Joi.string().trim().required().max(255),
    });

    const { value, error } = schema.validate({ email });

    if (error) {
      return {
        statusCode: StatusCode.BAD_REQUEST,
        data: error.message,
      };
    }

    const recoveryCodeOrError = await this.generateRecoveryCodeUsecase.execute({
      email: value.email,
    });

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
