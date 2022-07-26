import { Request, Response } from 'express';
import { ISignInUsecase } from '../../data/usecases/sign-in/sign-in';
import { UserCredentialsDTO } from '../../data/dtos/user-credentials';

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUsecase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const userOrError = UserCredentialsDTO.create(email, password);

      if (userOrError.isLeft()) {
        const error = userOrError.value;

        return response.status(400).json({
          error: error.message,
        });
      }

      return response.status(200).json({
        success: 'All good !',
      });
    } catch (error) {
      return response.sendStatus(500);
    }
  }
}
