import { NextFunction, Request, Response, Router } from 'express';
import { signInController } from '../di/sign-in-controller';
import { HttpRequest, HttpResponse } from '../../../../app/helpers/http';
import { BaseError } from '../../../../common/errors/base-error';
import { SignInRequest } from '../../adapters/controllers/sign-in';
import {
  AuthorizeUserMiddleware,
  AuthorizeUserParams,
} from '../middlewares/authorize-user';

const authenticationRouter = Router();

authenticationRouter.post(
  '/auth/sign-in',
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const signInRequest: SignInRequest = { email: email, password: password };
    const httpRequest: HttpRequest<SignInRequest> = { data: signInRequest };
    const httpResponse: HttpResponse = await signInController.handle(
      httpRequest,
    );
    response.status(httpResponse.statusCode).json({ data: httpResponse.data });
  },
);

authenticationRouter.use(
  async (request: Request, response: Response, next: NextFunction) => {
    const { userId } = request.body;
    const accessToken = request.headers.authorization ?? '';

    const authorizeUserParams: AuthorizeUserParams = {
      accessToken: accessToken,
      userId: userId ?? '',
    };
    const httpRequest: HttpRequest<AuthorizeUserParams> = {
      data: authorizeUserParams,
    };
    const httpResponse: HttpResponse = new AuthorizeUserMiddleware().authorize(
      httpRequest,
    );

    if (httpResponse.statusCode != 200) {
      response
        .status(httpResponse.statusCode)
        .json({ data: httpResponse.data });
    }

    next();
  },
);

export { authenticationRouter };
