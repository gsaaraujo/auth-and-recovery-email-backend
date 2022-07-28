import { HttpRequest } from '../app/helpers/http';
import { NextFunction, Request, Response, Router } from 'express';
import { authorizationMiddleware } from '../core/middlewares/authorization';
import { authenticationRouter } from '../modules/authentication/main/routes/authentication';

export const router = Router();
router.use(authenticationRouter);
router.use((request: Request, response: Response, next: NextFunction) => {
  const httpRequest: HttpRequest = { data: request.headers.authorization };
  const httpResponse = authorizationMiddleware(httpRequest);
  if (httpResponse) {
    response.status(httpResponse.statusCode).json({ data: httpResponse.data });
  }
  next();
});
router.get('/users', (_, response: Response) => {
  response.status(200).json('all good !');
});
