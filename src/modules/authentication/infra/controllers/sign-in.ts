import { Request, Response } from 'express';
import { ISignInUsecase } from '../../data/usecases/sign-in/sign-in';
import { UserCredentialsDTO } from '../../data/dtos/user-credentials';
import { UserSignedDTO } from '../../data/dtos/user-signed';

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUsecase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const userCredentialOrError = UserCredentialsDTO.create(email, password);

      if (userCredentialOrError.isLeft()) {
        const error = userCredentialOrError.value;

        return response.status(400).json({
          error: error.message,
        });
      }

      const userCredential: UserCredentialsDTO = userCredentialOrError.value;

      const userSignedOrError = await this.signInUsecase.execute(
        userCredential.email,
        userCredential.password,
      );

      if (userSignedOrError.isLeft()) {
        const error = userSignedOrError.value;

        return response.status(401).json({
          error: error.message,
        });
      }

      const userSigned: UserSignedDTO = userSignedOrError.value;

      return response.status(200).json({
        uid: userSigned.uid,
        name: userSigned.name,
        email: userSigned.email,
        accessToken: userSigned.accessToken,
        refreshToken: userSigned.refreshToken,
      });
    } catch (error) {
      return response.sendStatus(500);
    }
  }
}
