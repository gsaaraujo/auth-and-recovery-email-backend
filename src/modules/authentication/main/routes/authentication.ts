import { NextFunction, Request, Response, Router } from 'express';
import { signInController } from '../factories/sign-in';
import { HttpResponse } from '../../../../app/helpers/http';
import { SignInRequest } from '../../adapters/controllers/sign-in';
import { AuthorizeUserRequest } from '../../adapters/controllers/authorize-user';
import { ReauthorizeUserRequest } from '../../adapters/controllers/reauthorize-user';
import { authorizeUserController } from '../factories/authorize-user';
import { reauthorizeUserController } from '../factories/reauthorize-user';

const authenticationRouter = Router();

authenticationRouter.post(
  '/auth/sign-in',
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const signInRequest: SignInRequest = { email: email, password: password };
    const httpResponse: HttpResponse = await signInController.handle(
      signInRequest,
    );
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
    const authorizeUserParams: AuthorizeUserRequest = {
      accessToken: accessToken,
      userId: userId ?? '',
    };
    const httpResponse: HttpResponse =
      authorizeUserController.authorize(authorizeUserParams);

    if (httpResponse.statusCode != 200) {
      response.status(httpResponse.statusCode).json(httpResponse.data);
    }

    next();
  },
);

export { authenticationRouter };
