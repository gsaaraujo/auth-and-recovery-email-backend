import { BaseError } from '../../../../common/errors/base-error';
import { HttpResponse, unauthorized, ok } from '../../../../app/helpers/http';
import { IReauthorizeUserService } from '../../data/services/services/interfaces/reauthorize-user';

export type ReauthorizeUserRequest = {
  refreshToken: string;
};

export class ReauthorizeUserController {
  constructor(
    private readonly reauthorizeUserService: IReauthorizeUserService,
  ) {}

  async handle({
    refreshToken,
  }: ReauthorizeUserRequest): Promise<HttpResponse> {
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
