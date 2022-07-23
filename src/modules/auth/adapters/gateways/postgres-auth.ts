import { Client } from 'pg';
import { Either, left, right } from '../../../../app/helpers/either';
import { BaseError } from '../../../../core/errors/base-error';
import { DatabaseError } from '../../../../core/errors/database-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials';
import {
  IAuthRepository,
  UserDTO,
} from '../../application/repositories/sign-in';

class PostgresAuthGateway implements IAuthRepository {
  private readonly postgresDatabase: Client;

  constructor(postgresDatabase: Client) {
    this.postgresDatabase = postgresDatabase;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<Either<BaseError, UserDTO>> {
    try {
      await this.postgresDatabase.connect();

      const { rows } = await this.postgresDatabase.query(
        `SELECT * FROM users WHERE email=${email} AND password=${password}`,
      );

      if (rows.length === 0) {
        return left(
          new InvalidCredentialsError({
            message: 'Email or password is invalid.',
          }),
        );
      }

      const user: UserDTO = {
        uid: rows[0]['uid'],
        name: rows[0]['name'],
        email: rows[0]['email'],
      };

      return right(user);
    } catch (error) {
      return left(new DatabaseError({ message: 'error' }));
    } finally {
      await this.postgresDatabase.end();
    }
  }
}
