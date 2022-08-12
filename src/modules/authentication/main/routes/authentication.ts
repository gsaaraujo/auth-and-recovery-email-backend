import { NextFunction, Request, Response, Router } from 'express';

import { signInController } from '../factories/sign-in';
import { signUpController } from '../factories/sign-up';
import { HttpResponse } from '../../../../app/helpers/http';
import { authorizeUserController } from '../factories/authorize-user';
import { reauthorizeUserController } from '../factories/reauthorize-user';

const authenticationRouter = Router();

authenticationRouter.post(
  '/auth/sign-in',
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const httpResponse: HttpResponse = await signInController.handle({
      email,
      password,
    });
    response.status(httpResponse.status).json(httpResponse.data);
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
    response.status(httpResponse.status).json(httpResponse.data);
  },
);

authenticationRouter.get(
  '/auth/new-access-token',
  async (request: Request, response: Response) => {
    const httpResponse: HttpResponse = await reauthorizeUserController.handle({
      refreshToken: request.headers.authorization ?? '',
    });
    response.status(httpResponse.status).json(httpResponse.data);
  },
);

authenticationRouter.use(
  async (request: Request, response: Response, next: NextFunction) => {
    const { userId } = request.body;
    const httpResponse: HttpResponse = await authorizeUserController.handle({
      accessToken: request.headers.authorization ?? '',
      userId,
    });

    if (httpResponse.status != 200) {
      response.status(httpResponse.status).json(httpResponse.data);
      return;
    }

    next();
  },
);

export { authenticationRouter };
