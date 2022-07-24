import { ISignInUsecase } from '../../data/usecases/sign-in/sign-in';

export class SignInController {
  constructor(private readonly signInUsecase: ISignInUsecase) {}
  async handle(email: string, password: string): Promise<void> {
    const userSignedOrError = await this.signInUsecase.execute(email, password);
  }
}
