import { Client } from 'pg';
import { UserDTO } from '../../data/dtos/user';
import { BaseError } from '../../../../core/errors/base-error';
import { IUserRepository } from '../../data/ports/user-repository';
import { Either, left, right } from '../../../../app/helpers/either';
import { DatabaseError } from '../../../../core/errors/database-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials';

class PostgresAuthGateway implements IUserRepository {
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
        `SELECT * FROM users WHERE email=${email}`,
      );

      if (rows.length === 0) {
        return left(
          new InvalidCredentialsError({
            message: 'Email or password is incorrect.',
          }),
        );
      }

      const user: UserDTO = {
        uid: rows[0]['uid'],
        name: rows[0]['name'],
        email: rows[0]['email'],
        password: rows[0]['password'],
      };

      return right(user);
    } catch (error) {
      return left(new DatabaseError({ message: 'error' }));
    } finally {
      await this.postgresDatabase.end();
    }
  }
}
