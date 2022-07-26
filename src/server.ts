import 'dotenv/config';
import express from 'express';
import timeout from 'connect-timeout';
import { authenticationRouter } from './modules/authentication/main/authentication-routes';

const app = express();
app.use(timeout(5000));
app.use(express.json());
app.use(authenticationRouter);

const port = process.env.SERVER_PORT;

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is running at http://localhost:${port}`),
);
