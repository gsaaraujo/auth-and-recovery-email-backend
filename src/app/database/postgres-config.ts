import { Client } from 'pg';

class PostgresConfig {
  constructor() {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
    });
  }
}
