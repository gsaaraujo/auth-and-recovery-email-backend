import { BaseError } from '../../../../common/errors/base-error';
import {
  badRequest,
  HttpResponse,
  internalServerError,
  ok,
} from '../../../../app/helpers/http';
import { MissingParamError } from '../../../../common/errors/missing-param';
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
    try {
      if (!!!email.trim()) {
        return badRequest(new MissingParamError(email));
      }

      const userEmailDTO: UserEmailDTO = { email };
      const OrError = await this.generateRecoveryCodeUsecase.execute(
        userEmailDTO,
      );

      if (OrError.isLeft()) {
        const error: BaseError = OrError.value;
        return badRequest(error);
      }

      const DTO = OrError.value;
      OrError;

      return ok(DTO);
    } catch (error) {
      return internalServerError(new ServerError('Server error !'));
    }
  }
}
