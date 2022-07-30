import {
  HttpRequest,
  HttpResponse,
  unauthorized,
  ok,
} from '../../../../app/helpers/http';
import { BaseError } from '../../../../common/errors/base-error';
import { IReauthorizeUserService } from '../../data/services/services/interfaces/reauthorize-user';

export class ReauthorizeUserController {
  constructor(
    private readonly reauthorizeUserService: IReauthorizeUserService,
  ) {}

  async handle(refreshToken: string): Promise<HttpResponse> {
    const newAccessTokenOrError = await this.reauthorizeUserService.execute(
      refreshToken,
    );

    if (newAccessTokenOrError.isLeft()) {
      const error: BaseError = newAccessTokenOrError.value;
      return unauthorized(error);
    }

    const newAccessToken: string = newAccessTokenOrError.value;
    return ok(newAccessToken);
  }
}
