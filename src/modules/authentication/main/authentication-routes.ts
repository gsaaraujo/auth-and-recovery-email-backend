import { signInController } from './di';
import { Request, Response, Router } from 'express';
import { authorizationMiddleware } from '../../../core/middlewares/authorization';

const authenticationRouter = Router();

authenticationRouter.post(
  '/auth/sign-in',
  (request: Request, response: Response) => {
    signInController.handle(request, response);
  },
);

authenticationRouter.get(
  '/users',
  authorizationMiddleware,
  (request: Request, response: Response) => {
    response.status(200).json('all good !');
  },
);

export { authenticationRouter };
