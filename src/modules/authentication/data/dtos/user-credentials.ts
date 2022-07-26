import { UserCredentialsError } from '../errors/user-credentials';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';

export class UserCredentialsDTO {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(
    email: string,
    password: string,
  ): Either<UserCredentialsError, UserCredentialsDTO> {
    const errorMessage: string = this.validate(email, password);

    if (errorMessage) {
      return left(new UserCredentialsError(errorMessage));
    }

    return right(new UserCredentialsDTO(email, password));
  }

  static validate(email: string, password: string): string {
    if (email.trim().length === 0) {
      return 'The email must not be empty.';
    }

    if (password.trim().length === 0) {
      return 'The password must not be empty.';
    }

    if (email.length > 50) {
      return 'The email is too long. It must be less than 50 characters.';
    }

    if (!isEmailValid(email)) {
      return 'The email must be a valid email.';
    }

    if (password.length < 4) {
      return 'The password is too short. It must be between 4-8 characters';
    }

    if (password.length > 8) {
      return 'The password is too long. It must be between 4-8 characters';
    }

    return '';
  }
}
