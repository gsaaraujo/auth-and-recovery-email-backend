import { Either } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';
import { Controller, HttpResponse } from '../../../../app/helpers/controller';
import {
  ISignInUsecase,
  UserSignedDTO,
} from '../../data/usecases/sign-in/sign-in';

export type UserAuth = {
  email: string;
  password: string;
};

class SignInController implements Controller<UserAuth, UserSignedDTO> {
  constructor(private readonly signInUsecase: ISignInUsecase) {}

  async handle(
    data: UserAuth,
  ): Promise<Either<BaseError, HttpResponse<UserSignedDTO>>> {
    this.signInUsecase.execute('', '');
  }
}
