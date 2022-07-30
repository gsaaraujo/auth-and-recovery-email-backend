import { Response, Router } from 'express';
import { authenticationRouter } from '../modules/authentication/main/routes/authentication';

export const router = Router();
router.use(authenticationRouter);

router.get('/users', (_, response: Response) => {
  response.status(200).json('all good !');
});
