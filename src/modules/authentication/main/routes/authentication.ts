import { NextFunction, Request, Response, Router } from 'express';
import { signInController } from '../factories/sign-in';
import { HttpResponse } from '../../../../app/helpers/http';
import { SignInRequest } from '../../infra/controllers/sign-in';
import { AuthorizeUserRequest } from '../../infra/middlewares/authorize-user';
import { ReauthorizeUserRequest } from '../../infra/controllers/reauthorize-user';
import { authorizeUserMiddleware } from '../factories/authorize-user';
import { reauthorizeUserController } from '../factories/reauthorize-user';
import { SignUpRequest } from '../../infra/controllers/sign-up';
import { signUpController } from '../factories/sign-up';
import { GenerateRecoveryCodeRequest } from '../../infra/controllers/generate-recovery-code';
import { generateRecoveryCodeController } from '../factories/generate-recovery-code';

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
    const signUpRequest: SignUpRequest = { name, email, password };
    const httpResponse: HttpResponse = await signUpController.handle(
      signUpRequest,
    );
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.post(
  '/auth/get-recovery-code',
  async (request: Request, response: Response) => {
    const { email } = request.body;
    const generateRecoveryCodeRequest: GenerateRecoveryCodeRequest = { email };
    const httpResponse: HttpResponse =
      await generateRecoveryCodeController.handle(generateRecoveryCodeRequest);
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.get(
  '/auth/new-access-token',
  async (request: Request, response: Response) => {
    const reauthorizeUserRequest: ReauthorizeUserRequest = {
      refreshToken: request.headers.authorization ?? '',
    };
    const httpResponse: HttpResponse = await reauthorizeUserController.handle(
      reauthorizeUserRequest,
    );
    response.status(httpResponse.statusCode).json(httpResponse.data);
  },
);

authenticationRouter.use(
  async (request: Request, response: Response, next: NextFunction) => {
    const { userId } = request.body;
    const accessToken = request.headers.authorization ?? '';
    const authorizeUserRequest: AuthorizeUserRequest = {
      accessToken: accessToken,
      userId: userId ?? '',
    };
    const httpResponse: HttpResponse =
      authorizeUserMiddleware.authorize(authorizeUserRequest);

    if (httpResponse.statusCode != 200) {
      response.status(httpResponse.statusCode).json(httpResponse.data);
    }

    next();
  },
);

export { authenticationRouter };
