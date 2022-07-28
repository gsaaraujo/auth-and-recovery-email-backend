import express from 'express';
import timeout from 'connect-timeout';
import { router } from './routes';

export const app = express();
app.use(timeout(5000));
app.use(express.json());
app.use('/api', router);
