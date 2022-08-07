import 'dotenv/config';
import { app } from './app';
import { SERVER_PORT } from '../app/helpers/env';

const port = SERVER_PORT;

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`),
);
