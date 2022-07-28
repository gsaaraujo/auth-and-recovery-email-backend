import { Request, Response, Router } from 'express';
import { signInController } from '../di/sign-in-controller';
import { authorizationMiddleware } from '../../../../main/middlewares/authorization';
import { HttpRequest, HttpResponse } from '../../../../app/helpers/http';

export const authenticationRouter = Router();

authenticationRouter.post(
  '/auth/sign-in',
  async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      data: request.body,
    };
    const httpResponse: HttpResponse = await signInController.handle(
      httpRequest,
    );
    response.status(httpResponse.statusCode).json({ data: httpResponse.data });
  },
);

authenticationRouter.get(
  '/users',
  authorizationMiddleware,
  (request: Request, response: Response) => {
    response.status(200).json('all good !');
  },
);
