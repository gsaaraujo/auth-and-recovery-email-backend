import { NextFunction, Request, Response, Router } from 'express';

import { signInController } from '../factories/sign-in';
import { signUpController } from '../factories/sign-up';
import { HttpResponse } from '../../../../app/helpers/http';
import { SignInRequest } from '../../infra/controllers/sign-in';
import { authorizeUserMiddleware } from '../factories/authorize-user';
import { reauthorizeUserController } from '../factories/reauthorize-user';
import { AuthorizeUserRequest } from '../../infra/middlewares/authorize-user';
import { ReauthorizeUserRequest } from '../../infra/controllers/reauthorize-user';
import { generateRecoveryCodeController } from '../factories/generate-recovery-code';
import { GenerateRecoveryCodeRequest } from '../../infra/controllers/generate-recovery-code';

const authenticationRouter = Router();

authenticationRouter.post(
  '/auth/sign-in',
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const signInRequest: SignInRequest = { email, password };
    const httpResponse: HttpResponse = await signInController.handle(
      signInRequest,
    );
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.post(
  '/auth/sign-up',
  async (request: Request, response: Response) => {
    const { name, email, password } = request.body;
    const httpResponse: HttpResponse = await signUpController.handle({
      name,
      email,
      password,
    });
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.post(
  '/auth/get-recovery-code',
  async (request: Request, response: Response) => {
    const { email } = request.body;
    const httpResponse: HttpResponse =
      await generateRecoveryCodeController.handle({ email });
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.get(
  '/auth/new-access-token',
  async (request: Request, response: Response) => {
    const httpResponse: HttpResponse = await reauthorizeUserController.handle({
      refreshToken: request.headers.authorization ?? '',
    });
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.use(
  async (request: Request, response: Response, next: NextFunction) => {
    const { userId } = request.body;
    const httpResponse: HttpResponse = authorizeUserMiddleware.authorize({
      accessToken: request.headers.authorization ?? '',
      userId: userId ?? '',
    });

    if (httpResponse.statusCode != 200)
      response.status(httpResponse.statusCode).json(httpResponse.data);

    next();
  },
);

export { authenticationRouter };
