import { Client } from 'pg';
import { Either, left, right } from 'fp-ts/lib/Either';
import { BaseError } from '../../../../core/errors/base-error';
import { DatabaseError } from '../../../../core/errors/database-error';
import { UserCredentialsDTO } from '../../application/usecases/sign-in';
import { IAuthRepository } from '../../application/repositories/sign-in';

class PostgresAuthGateway implements IAuthRepository {
  private readonly postgresDatabase: Client;

  constructor(postgresDatabase: Client) {
    this.postgresDatabase = postgresDatabase;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserCredentialsDTO>> {
    try {
      await this.postgresDatabase.connect();

      const { rows } = await this.postgresDatabase.query(
        `SELECT * FROM users WHERE email=${email} AND password=${password}`,
      );

      const userCredentials: UserCredentialsDTO = {
        uid: rows[0]['uid'],
        name: rows[0]['name'],
        email: rows[0]['email'],
      };

      return right(userCredentials);
    } catch (error) {
      return left(new DatabaseError({ message: 'error' }));
    } finally {
      await this.postgresDatabase.end();
    }
  }
}
