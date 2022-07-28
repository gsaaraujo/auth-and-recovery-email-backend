import { Request, Response } from 'express';
import {
  ok,
  badRequest,
  HttpRequest,
  HttpResponse,
  internalServerError,
} from '../../../../app/helpers/http';
import { UserSignedEntity } from '../../domain/entities/user-signed';
import { ISignInUsecase } from '../../domain/usecases/sign-in';

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUsecase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.data;
      const userSignedOrError = await this.signInUsecase.execute(
        email,
        password,
      );

      if (userSignedOrError.isLeft()) {
        const error = userSignedOrError.value;
        return badRequest(error.message);
      }

      const userSignedEntity: UserSignedEntity = userSignedOrError.value;
      const data = {
        uid: userSignedEntity.uid,
        name: userSignedEntity.name,
        email: userSignedEntity.email,
        accessToken: userSignedEntity.accessToken,
        refreshToken: userSignedEntity.refreshToken,
      };
      return ok(data);
    } catch (error) {
      return internalServerError('server error');
    }
  }
}
