import { signInController } from './di';
import express, { Request, Response } from 'express';

const authenticationRouter = express.Router();

authenticationRouter.post(
  '/auth/sign-in',
  (request: Request, response: Response) => {
    signInController.handle(request, response);
  },
);

export { authenticationRouter };
