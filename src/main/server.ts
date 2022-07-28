import 'dotenv/config';
import { app } from './app';

const port = process.env.SERVER_PORT;

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`),
);
