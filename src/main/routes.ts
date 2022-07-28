import { Router } from 'express';
import { authenticationRouter } from '../modules/authentication/main/routes/authentication';

export const router = Router();
router.use(authenticationRouter);
